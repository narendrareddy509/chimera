import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';
import { ChargeTableService } from '../../services/charge-table.service';
import { GeneralConfiguration } from '../../model/planIndex.model';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormulaTableService } from '../../services/formula-table.service';

@Component({
  selector: 'ignatica-surrender-formula',
  templateUrl: './surrender-formula.component.html',
  styleUrls: ['./surrender-formula.component.scss'],
})
export class PlanFormulaComponent implements OnInit, OnChanges {
  @Input() product: any;
  @ViewChild('labelImport')
  labelImport: ElementRef;
  @Input() SurrenderFormulaData = [];
  @Output() surrenderChargesEmit = new EventEmitter<object>();
  @Input() formulas: any;
  formImport: FormGroup;

  fileToUpload: File = null;
  fileName: string;
  error = '';
  success = '';
  loading = false;
  uploadLoading = false;
  showInvalid = false;
  formulaCols = ['coverageYear', 'surrenderChargeAmount'];
  uploadedSurrenderFormulas = [];
  filterFormulas: any[] = null;
  @ViewChild('FormUpdate') formUpdate: NgForm;
  surrenderRatePercentage: number = 100;
  surrenderFormulas: string;
  @Input() eventsSubject: Observable<void>;
  eventsSubscription: Subscription;
  IG_CAL_SURRENDER_FORMULA_003 = 'IG_CAL_SURRENDER_FORMULA_003';
  IG_CAL_SURRENDER_FORMULA_001 = 'IG_CAL_SURRENDER_FORMULA_001';
  saveClicked: boolean = false;
  formValid: boolean = true;
  @Input() disableControl: boolean = false;

  constructor(
    private papa: Papa,
    private toastService: ToastService,
    private translateService: TranslateService,
    private formulaTableService: FormulaTableService
  ) {
    this.formImport = new FormGroup({
      importFile: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.SurrenderFormulaData &&
      this.SurrenderFormulaData.length > 0 &&
      this.SurrenderFormulaData[0].code === 'IG_CAL_SURRENDER_FORMULA_001'
    ) {
      this.surrenderFormulas = this.IG_CAL_SURRENDER_FORMULA_001;
    }
  }

  ngOnInit(): void {
    if (this.product && this.product.formulas) {
      this.filterFormulas = this.product.formulas.filter(
        (x) => x.code.indexOf('IG_CAL_SURRENDER_FORMULA') >= 0
      );

      // If formula is removed from product, then we are clearing data from saved plan
      if (
        this.filterFormulas.length &&
        this.filterFormulas
          .map((x) => x.code)
          .indexOf(this.IG_CAL_SURRENDER_FORMULA_003) === -1
      ) {
        this.formulas.forEach((formula, i) => {
          if (formula && formula.eventCode.indexOf('IG_EVENT_SURRENDER') >= 0) {
            this.formulas.splice(i, 1);
          }
        });
      }
      // If  IG_CAL_SURRENDER_FORMULA_001 formula event is removed from product, then we are clearing  respective surrender formula data from formulaTable
      if (
        this.filterFormulas.length &&
        this.filterFormulas
          .map((x) => x.code)
          .indexOf(this.IG_CAL_SURRENDER_FORMULA_001) === -1
      ) {
        this.formulaTableService.setSelectSurrenderValue('');
        this.SurrenderFormulaData = [];
      }
    }
    // Setting the % value if it is available in saved plan data
    if (this.formulas && this.formulas.length > 0) {
      const surFormula = this.formulas.find(
        (x) => x && x.eventCode.indexOf('IG_EVENT_SURRENDER') >= 0
      );
      this.surrenderFormulas = (surFormula && surFormula.formulas[0]) || null;
      if (this.surrenderFormulas === this.IG_CAL_SURRENDER_FORMULA_003) {
        this.surrenderRatePercentage = surFormula.surrenderRate * 100;
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.saveClicked = true;
      if (
        this.filterFormulas &&
        this.filterFormulas.length &&
        !this.surrenderFormulas
      ) {
        this.formValid = false;
        return;
      }

      if (
        this.surrenderFormulas === this.IG_CAL_SURRENDER_FORMULA_001 &&
        this.SurrenderFormulaData &&
        this.SurrenderFormulaData.length <= 0
      ) {
        this.formValid = false;
        return;
      } else if (this.surrenderFormulas === this.IG_CAL_SURRENDER_FORMULA_003) {
        let formulaFound = false;
        this.formulas.forEach((formula) => {
          if (formula && formula.eventCode.indexOf('IG_EVENT_SURRENDER') >= 0) {
            formulaFound = true;
            formula.surrenderRate = this.surrenderRatePercentage / 100;
          }
        });
        if (!formulaFound) {
          this.formulas.push({
            eventCode: 'IG_EVENT_SURRENDER',
            surrenderRate: this.surrenderRatePercentage / 100,
            formulas: [this.IG_CAL_SURRENDER_FORMULA_003],
          });
        }
        this.formValid = this.formUpdate.valid;
      } else {
        this.formValid = true;
        this.formulas.forEach((formula, i) => {
          if (formula && formula.eventCode.indexOf('IG_EVENT_SURRENDER') >= 0) {
            this.formulas.splice(i, 1);
          }
        });
      }
    });
  }
  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = '';
    if (!files.item(0).name.endsWith('.csv')) {
      this.showInvalid = true;
      return;
    }
    this.showInvalid = false;
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map((f) => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

  stepHandler = ({ data }) => {
    try {
      this.checkIfRequiredColumnsMissing(data);
      this.checkIfKeysIsValid(data);
      this.uploadedSurrenderFormulas.push(data);
    } catch (e) {
      this.uploadLoading = false;
      this.toastService.show({
        title: 'Error',
        description: e,
        classname: 'warning',
      });
      this.labelImport.nativeElement.innerText = '';
      this.fileToUpload = null;
      this.formImport.reset();
      this.uploadedSurrenderFormulas = [];
      throw e;
    }
  };

  import(): void {
    if (!this.fileToUpload) {
      this.showInvalid = true;
      return;
    }
    this.showInvalid = false;
    this.success = '';
    this.error = '';
    this.uploadLoading = true;
    this.papa.parse(this.fileToUpload, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      worker: true,
      step: this.stepHandler,
      complete: (result) => {
        this.fileName = this.labelImport.nativeElement.innerText;
        if (this.uploadedSurrenderFormulas.length > 0) {
          let mappedData = this.uploadedSurrenderFormulas.map((x) => {
            let charge = {
              srcFile: this.fileName,
              coverageYear: x['Year of Coverage'],
              surrenderChargeAmount: x['Surrender Charge Amount'],
              isActive: true,
            };
            return charge;
          });
          this.surrenderChargesEmit.emit(mappedData);
          this.SurrenderFormulaData.push(...mappedData);
          this.uploadLoading = false;
          this.labelImport.nativeElement.innerText = '';
          this.fileToUpload = null;
          this.loading = false;
          this.formImport.reset();
          const message = 'Successfully Uploaded Surrender Formula Table';
          this.toastService.show({
            title: this.translateService.instant(
              'plan.alertMessages.errorHeading'
            ),
            description: message,
            classname: 'warning',
          });
        }
      },
      error: (e) => {
        console.log('Error: ', e);
        this.uploadLoading = false;
      },
    });
  }

  changeSurrenderEvent(event) {
    this.surrenderFormulas = event;
    console.log('this.surrenderFormulas', this.surrenderFormulas);
    this.formulaTableService.setSelectSurrenderValue(this.surrenderFormulas);
    if (this.SurrenderFormulaData && this.SurrenderFormulaData.length > 0) {
      this.SurrenderFormulaData[0].code = '';
    }
  }

  checkIfRequiredColumnsMissing(row): boolean {
    let output: boolean = true;
    try {
      const keysInRow = Object.keys(row);
      const formattedKeysInRow = keysInRow.map((key) => key.toLowerCase());
      ['year of coverage', 'surrender charge amount'].forEach((column) => {
        if (!formattedKeysInRow.includes(column)) {
          const errMessage = `Please upload a CSV file with 2 columns: Year of Coverage, and Surrender Charge Amount.`;
          throw new Error(errMessage);
        }
      });
      output = false;
    } catch (e) {
      console.log('[checkIfRequiredColumnsMissing] Error: ', e);
      throw e;
    }
    return output;
  }

  checkIfKeysIsValid(row: any): void {
    try {
      const keysInRow = Object.keys(row);
      keysInRow.forEach((key) => {
        let formattedKey = key.toLowerCase();
        // check if value is non-numeric
        if ('number' != typeof row[key]) {
          const errMessage = `There is a non-numeric value in the ${key} column`;
          throw new Error(errMessage);
        }
        // check if negative number
        if (row[key] < 0) {
          const errMessage = `There is a negative value in  the ${key} column`;
          throw new Error(errMessage);
        }
        if ('year of coverage' == formattedKey) {
          if (row[key] > 99 || row[key] < 1) {
            const errMessage = `Please upload years of coverage from 1 to 99.`;
            throw new Error(errMessage);
          }
        }
        if ('surrender charge amount' == formattedKey) {
          let keyLen = (row[key] + '').split('.');
          if (
            keyLen[0].length > 10 ||
            (keyLen && keyLen[1] && keyLen[1].length > 2)
          ) {
            const errMessage = `Please upload surrender charge amounts with maximum 10 digits and 2 decimal places.`;
            throw new Error(errMessage);
          }
        }
      });
    } catch (e) {
      console.log('[checkIfKeysIsValid] Error: ', e);
      throw e;
    }
  }
}
