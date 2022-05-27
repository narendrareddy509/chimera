import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';
import { ChargeTableService } from '../../../services/charge-table.service';
import { ModalService } from '@shared/custom/component/modal/modal.service';
import { ImportCsvTableComponent } from '../import-csv-table/import-csv-table.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/custom/component/confirm-modal/confirm-modal.component';

@Component({
  selector: 'ignatica-plan-charge-rate-table',
  templateUrl: './plan-charge-rate-table.component.html',
  styleUrls: ['./plan-charge-rate-table.component.scss'],
})
export class PlanChargeRateTableComponent implements OnInit {
  @Output() saveChargesEmit = new EventEmitter<object>();
  @Input() chargerates = [];
  @Input() feesChargesOID: string;
  @Input() chargeType: string;
  @Input() planGuid: string = null;
  @Input() disableControl: boolean = false;
  fileToUpload: File = null;
  uploadForm: FormGroup;
  fileName: string;
  error = '';
  success = '';
  loading = false;
  uploadLoading = false;
  showInvalid = false;
  chargeCols = ['periodInYears', 'rate'];
  uploadedCharges = [];
  modalOptions: NgbModalOptions;
  selectedAll: boolean = false;
  isCollapsed: boolean = true;

  constructor(
    private modalService: NgbModal,
    private papa: Papa,
    public popupService: ModalService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private chargeTableService: ChargeTableService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'ignatica-confirmation-modal',
    };
  }

  ngOnInit(): void {}
  openDialog(message) {
    const dialogRef = this.modalService.open(
      ConfirmModalComponent,
      this.modalOptions
    );
    dialogRef.componentInstance.data = {
      title: this.translateService.instant(message),
      confirmBtnText: this.translateService.instant('plan.alertMessages.yes'),
      cancelBtnText: this.translateService.instant('plan.alertMessages.no'),
    };
    return dialogRef;
  }
  stepHandler = ({ data }) => {
    try {
      this.checkIfRequiredColumnsMissing(data);
      data['feesChargesOID'] = this.feesChargesOID;
      // this.verifyChargeConfig(data);
      if (!this.isDuplicateCharges(data)) {
        this.uploadedCharges.push(data);
      }
    } catch (e) {
      this.uploadLoading = false;
      this.toastService.show({
        title: 'Error',
        description: e,
        classname: 'warning',
      });
      this.fileToUpload = null;
      this.uploadedCharges = [];
      throw e;
    }
  };
  checkIfRequiredColumnsMissing(row): boolean {
    let output: boolean = true;
    try {
      const keysInRow = Object.keys(row);
      const formattedKeysInRow = keysInRow.map((key) => key);
      ['Coverage Year', 'Charge Percentage'].forEach((column) => {
        if (!formattedKeysInRow.includes(column)) {
          const errMessage = `The ${column} column is missing`;
          //this.error$.next(errMessage);
          throw new Error(errMessage);
        }
      });

      output = false;
    } catch (e) {
      console.log(
        '[CsvParserService.checkIfRequiredColumnsMissing] Error: ',
        e
      );
      throw e;
    }

    return output;
  }

  public valueReadability(num: any) {
    if (isNaN(num)) return num;
    if (num % 1 !== 0) {
      if (num.toString().split('.')[1].length > 1) return num.toFixed(2);
      else return num;
    }
    return num;
  }

  public onChargeSelect(i, event) {
    this.chargerates[i]['isDeleted'] = event.target.checked;
  }

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
        let zeroCoverageData = [];
        if (this.uploadedCharges.length > 0) {
          zeroCoverageData.push(
            ...this.uploadedCharges.filter((x) => x['Coverage Year'] == 0)
          );
          zeroCoverageData.push(
            ...this.chargerates.filter((x) => x['periodInYears'] == 0)
          );
          if (zeroCoverageData.length <= 0) {
            let errMessage;
            switch (this.chargeType) {
              case 'IG_CHARGES_FUND_DEPOSIT_REGULAR':
                errMessage =
                  'Regular charge structure is missing for first year (coverage year as 0)';
                break;
              case 'IG_CHARGES_FUND_DEPOSIT_SUBSEQUENT':
                errMessage =
                  'Top up charge structure is missing for first year (coverage year as 0)';
                break;
              case 'IG_CHARGES_FUND_WITHDRAWAL':
                errMessage =
                  'Withdrawal charge structure is missing for first year (coverage year as 0)';
                break;
            }
            this.uploadLoading = false;
            this.toastService.show({
              title: 'Error',
              description: errMessage,
              classname: 'warning',
            });
            this.fileToUpload = null;
            this.uploadedCharges = [];
          } else {
            let mappedData = this.uploadedCharges.map((x) => {
              let charge = {
                periodInYears: x['Coverage Year'],
                rate: x['Charge Percentage'] / 100,
                isDeleted: false,
              };
              return charge;
            });
            this.chargerates.push(...mappedData);
            this.chargerates.sort((a, b) => a.periodInYears - b.periodInYears);
            this.saveChargesEmit.emit({
              param1: this.chargerates,
              param2: this.feesChargesOID,
            });
            this.uploadLoading = false;
            this.fileToUpload = null;
            this.loading = false;
            this.isCollapsed = false;
            this.uploadedCharges = [];
          }
        }
      },
      error: (e) => {
        console.log('Error: ', e);
        this.uploadLoading = false;
        this.toastService.show({
          title: 'Error',
          description: e,
          classname: 'warning',
        });
        this.fileToUpload = null;
        this.uploadedCharges = [];
      },
    });
  }

  isDuplicateCharges(data: any) {
    let duplicateCharges = [];
    let duplicateUploadedCharges = [];
    duplicateCharges = this.uploadedCharges.filter(
      (x) => x['Coverage Year'] == data['Coverage Year']
    );
    duplicateUploadedCharges = this.chargerates.filter(
      (x) => x['periodInYears'] == data['Coverage Year']
    );

    if (duplicateCharges.length > 0 || duplicateUploadedCharges.length > 0) {
      const errMessage = `Duplicate charges rows detected`;
      this.toastService.show({
        title: 'Error',
        description: errMessage,
        classname: 'warning',
      });
      this.uploadLoading = false;
    }
    return duplicateCharges.length > 0 || duplicateUploadedCharges.length > 0;
  }

  uploadCsv() {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      scrollable: false,
    };
    const data = {
      title: 'Import Charges',
      subTitle: 'Import charges from CSV file',
      labels: {
        button: {
          first: 'Cancel',
          second: 'Upload',
        },
      },
    };
    const modalRef = this.popupService.open(
      ImportCsvTableComponent,
      data,
      modalOptions
    );
    modalRef.closed.subscribe((data) => {
      if (data.confirmed) {
        this.fileToUpload = data.fileToUpload;
        this.fileName = data.fileToUpload.name;
        this.import();
      }
    });
  }

  selectAllChange() {
    this.chargerates.map((x) => {
      x['isDeleted'] = this.selectedAll;
      return x;
    });
  }

  removeSelectedRows() {
    if (this.chargerates.filter((x) => x['isDeleted']).length <= 0) {
      this.toastService.show({
        title: 'Error',
        description: 'Please select at least a row',
        classname: 'warning',
      });
      return;
    }
    const dialogRef = this.openDialog('plan.alertMessages.deleteConfirm');
    dialogRef.closed.subscribe((isConfirmed) => {
      if (isConfirmed) {
        if (this.selectedAll) {
          this.chargerates = [];
        } else {
          let notDeletedCharges = this.chargerates.filter(
            (row) => !row['isDeleted']
          );
          this.chargerates = notDeletedCharges;
        }
        this.selectedAll = false;
        this.saveChargesEmit.emit({
          param1: this.chargerates,
          param2: this.feesChargesOID,
        });
      }
    });
  }
}
