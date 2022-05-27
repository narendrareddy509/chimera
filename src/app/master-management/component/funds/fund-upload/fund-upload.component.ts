import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import _ from 'lodash';
import { FundService } from '../../../service/fund.service';
import { TranslateService } from '@ngx-translate/core';
import { FundAddComponent } from '../fund-add/fund-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ignatica-fund-upload',
  templateUrl: './fund-upload.component.html',
  styleUrls: ['./fund-upload.component.scss'],
})
export class FundUploadComponent implements OnInit {
  @ViewChild('labelImport')
  labelImport: ElementRef;
  formImport: FormGroup;
  fileToUpload: File = null;
  uploadForm: FormGroup;
  fileName: string;
  error = '';
  success = '';
  loading = false;
  uploadLoading = false;
  showInvalid = false;
  fundCols = [
    'fundId',
    'fundName',
    'fundCategory',
    'fundISIN',
    'description',
    'buyPrice',
    'sellPrice',
  ];
  fundHeaders = [
    'Fund ID',
    'Fund Name',
    'Fund Category',
    'Fund ISIN',
    'Description',
    'Buy Price',
    'SellPrice',
  ];
  fundData = [];
  uploadedFundData = [];
  addFundBoolean: Boolean = false;
  fundsPrice = [];

  message: string;
  action: string;
  showAlert: boolean = false;
  private _success = new Subject<string>();

  constructor(
    private papa: Papa,
    private fundService: FundService,
    private translateService: TranslateService,
    private dialog: NgbModal
  ) {
    this.formImport = new FormGroup({
      importFile: new FormControl('', Validators.required),
    });
    this.fundService.getAllFunds().subscribe((response: any) => {
      this.fundService.getAllFundPrices().subscribe((fundResponse: any) => {
        let fundsPrice = fundResponse['data'];
        this.fundData = response['data'].map((x) => {
          let fundPrice = fundsPrice.filter((y) => y.fundId == x.fundId)[0];
          x['buyPrice'] = fundPrice?.latestFundPrice.buyPrice;
          x['sellPrice'] = fundPrice?.latestFundPrice.sellPrice;
          return x;
        });
      });
    });
  }

  ngOnInit(): void {
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      this.showAlert = false;
    });
  }
  stepHandler = ({ data }) => {
    try {
      let keys = Object.keys(data);
      if (JSON.stringify(this.fundCols) !== JSON.stringify(keys)) {
        const errMessage = `Invalid fields.Please download the template and retry`;
        throw new Error(errMessage);
      }
      ['FundID', 'FundName', 'FundCurrency'].forEach((x) => {
        if (data[x] === null || data[x] === '' || !data[x]) {
          const errMessage = `Please provide the ${x}`;
          throw new Error(errMessage);
        }
      });
      let masterFund = this.fundData.filter(
        (x) => x['FundID'] == data['FundID']
      );
      let uploadedFund = this.uploadedFundData.filter(
        (x) => x['FundID'] == data['FundID']
      );
      if (masterFund.length > 0 || uploadedFund.length > 0) {
        const errMessage = this.translateService.instant(
          'fund.duplicatFundIDError'
        );
        throw new Error(errMessage);
      }

      if (data['Buy Fees'] && data['Buy Fees'] < 0) {
        const errMessage = `Please provide fund Buy Fees that are greater than or equal to 0.`;
        throw new Error(errMessage);
      }
      if (data['Sell Fees'] && data['Sell Fees'] < 0) {
        const errMessage = `Please provide fund Sell Fees that are greater than or equal to 0.`;
        throw new Error(errMessage);
      }
      this.uploadedFundData.push(data);
    } catch (e) {
      this.uploadLoading = false;
      this.message = e;
      this.action = 'warning';
      this.showAlert = true;
      this._success.next('opened');

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this.labelImport.nativeElement.innerText = '';
      this.fileToUpload = null;
      this.formImport.reset();
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
        if (this.uploadedFundData.length > 0) {
          this.fundService
            .saveFund(this.uploadedFundData, this.fileName, 'IG_ASSET_FUND')
            .subscribe((response) => {
              let funds = response['data'].map((x) => x.asset);
              this.fundData.push(...funds);
              const message = 'Successfully Uploaded Fund';

              this.message = message;
              this.action = 'success';
              this.showAlert = true;
              this._success.next('opened');

              window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });

              this.uploadLoading = false;
              this.labelImport.nativeElement.innerText = '';
              this.fileToUpload = null;
              this.loading = false;
              this.formImport.reset();
            });
        } else {
          const message = 'Fund rows are empty.Please add fund details';
          this.message = message;
          this.action = 'warning';
          this.showAlert = true;
          this._success.next('opened');
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
          this.uploadLoading = false;
          this.labelImport.nativeElement.innerText = '';
          this.fileToUpload = null;
          this.loading = false;
          this.formImport.reset();
        }
      },
      error: (e) => {
        console.log('Error: ', e);
        this.uploadLoading = false;
      },
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

  addFund() {
    const dialogRef = this.dialog.open(FundAddComponent, { size: 'lg' });
    dialogRef.componentInstance.data = this.fundData;
    dialogRef.closed.subscribe((fund) => {
      if (fund.data) {
        this.fundService.getAllFunds().subscribe((response: any) => {
          let funds = response['funds'].map((x) => x.asset);
          this.fundData = [];
          this.fundData.push(...funds);
        });
      }
    });
  }

  downloadTemplate(): void {
    const csv = this.papa.unparse({
      data: [
        {
          FundID: 'KMNB',
          FundName: 'KMNB Mixed Fund',
          FundCurrency: 'USD',
          ServiceURL: '',
          'Buy Fees': '',
          'Sell Fees': '',
        },
        {
          FundID: 'HGFT',
          FundName: 'HGFT High Velocity Fund',
          FundCurrency: 'HKD',
          ServiceURL: 'fundmanagement@hgft.com',
          'Buy Fees': '4',
          'Sell Fees': '7.254',
        },
      ],
    });
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;

    //if (navigator.msSaveBlob) {
    //csvURL = navigator.msSaveBlob(csvData, 'Fund.csv');
    //} else {
    // csvURL = window.URL.createObjectURL(csvData);
    // }
    // For Browser
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'Fund.csv');
    tempLink.click();
  }
}
