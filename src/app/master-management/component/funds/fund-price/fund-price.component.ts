import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Papa } from 'ngx-papaparse';
import _ from 'lodash';
import { FundService } from '../../../service/fund.service';
import { CreateFundPriceComponent } from '../create-fund-price/create-fund-price.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ignatica-fund-price',
  templateUrl: './fund-price.component.html',
  styleUrls: ['./fund-price.component.scss'],
})
export class FundPriceComponent implements OnInit {
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
  fundPriceCols = [
    'fundId',
    'fundCategory',
    'effectiveStartDate',
    'effectiveEndDate',
    'buyPrice',
    'sellPrice',
  ];
  fundPriceHeaderCols = [
    'Fund Id',
    'Fund Category',
    'EffectiveStartDate',
    'EffectiveEndDate',
    'Buy Price',
    'Sell Price',
  ];
  fundPriceData = [];
  fundData = [];
  uploadedFundPriceData = [];

  message: string;
  action: string;
  showAlert: boolean = false;
  private _success = new Subject<string>();

  constructor(
    public dialog: NgbModal,
    private papa: Papa,
    private fundService: FundService
  ) {
    this.formImport = new FormGroup({
      importFile: new FormControl('', Validators.required),
    });
    this.fundService.getAllFundPrices().subscribe((response: any) => {
      this.fundPriceData = response['data'].map((x) => {
        return {
          fundId: x.fundId,
          fundCategory: x.fundCategory,
          buyPrice: x.latestFundPrice.buyPrice,
          sellPrice: x.latestFundPrice.sellPrice,
          effectiveStartDate: x.latestFundPrice.effectiveStartDate,
          effectiveEndDate: x.latestFundPrice.effectiveEndDate,
        };
      });
    });
  }

  ngOnInit(): void {
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      this.showAlert = false;
    });
  }
  addFundPrice() {
    const dialogRef = this.dialog.open(CreateFundPriceComponent, {
      size: 'lg',
    });
    dialogRef.componentInstance.data = {
      fundPriceData: this.fundPriceData,
      fundData: this.fundData,
    };
    dialogRef.closed.subscribe((fundPrice) => {
      if (fundPrice.data) {
        this.fundService.getAllFundPrices().subscribe((response: any) => {
          let funds = response['data'].map((x) => x.asset);
          this.fundPriceData = [];
          this.fundPriceData.push(...funds);
        });
      }
    });
  }

  downloadTemplate(): void {
    const csv = this.papa.unparse({
      data: [
        {
          'Fund ID': 'AMNKL',
          'Fund price effective date': '2021-01-01',
          'Fund price expiry date': '2021-12-31',
          'Buy price': 6.09331,
          'Sell price': 9.09258,
        },
        {
          'Fund ID': 'DFRGT',
          'Fund price effective date': '2021-01-01',
          'Fund price expiry date': '',
          'Buy price': 6,
          'Sell price': 9,
        },
      ],
    });
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;

    // if (navigator.msSaveBlob) {
    // csvURL = navigator.msSaveBlob(csvData, 'FundPrice.csv');
    //} else {
    //csvURL = window.URL.createObjectURL(csvData);
    //}

    // For Browser
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'FundPrice.csv');
    tempLink.click();
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
      let keys = Object.keys(data);
      if (JSON.stringify(this.fundPriceCols) !== JSON.stringify(keys)) {
        const errMessage = `Invalid fields.Please download the template and retry`;
        throw new Error(errMessage);
      }
      [
        'Fund ID',
        'Fund price effective date',
        'Buy price',
        'Sell price',
      ].forEach((x) => {
        if (data[x] === null || data[x] === '' || !data[x]) {
          const errMessage = `Please provide the ${x}`;
          throw new Error(errMessage);
        }
      });
      let masterFund = this.fundData.filter(
        (x) => x['FundID'] == data['Fund ID']
      );
      if (masterFund.length <= 0) {
        const errMessage = `An invalid fund ID is provided: ${data['Fund ID']}.`;
        throw new Error(errMessage);
      }

      if (
        !moment(data['Fund price effective date'], 'YYYY-MM-DD', true).isValid()
      ) {
        const errMessage = `Please provide Fund price effective date in the YYYY-MM-DD format.`;
        throw new Error(errMessage);
      }
      if (
        data['Fund price expiry date'] &&
        !moment(data['Fund price expiry date'], 'YYYY-MM-DD', true).isValid()
      ) {
        const errMessage = `Please provide Fund price effective date in the YYYY-MM-DD format.`;
        throw new Error(errMessage);
      }
      if (
        data['Fund price expiry date'] &&
        moment(data['Fund price expiry date']) <
          moment(data['Fund price effective date'])
      ) {
        const errMessage = `Fund price expiry date should be greater than or equal to effective date for : ${data['Fund ID']}`;
        throw new Error(errMessage);
      }
      if (data['Buy price'] < 0 || data['Sell price'] < 0) {
        const errMessage = `Please provide fund prices that are greater than or equal to 0.`;
        throw new Error(errMessage);
      }
      let buyPriceDecimals =
        Math.floor(data['Buy price']) === data['Buy price']
          ? 0
          : data['Buy price'].toString().split('.')[1].length || 0;
      let sellPriceDecimals =
        Math.floor(data['Sell price']) === data['Sell price']
          ? 0
          : data['Sell price'].toString().split('.')[1].length || 0;

      if (buyPriceDecimals > 5) {
        const errMessage = `Buy price decimal positions are more than 5 for (${data['Fund ID']})`;
        throw new Error(errMessage);
      }
      if (sellPriceDecimals > 5) {
        const errMessage = `Sell price decimal positions are more than 5 for (${data['Fund ID']})`;
        throw new Error(errMessage);
      }

      let samePeriodFundPricesUploaded = this.uploadedFundPriceData.filter(
        (x) =>
          x['Fund ID'] == data['Fund ID'] &&
          x['Fund price expiry date'] == data['Fund price expiry date'] &&
          x['Fund price effective date'] == data['Fund price effective date']
      );

      let samePeriodFundPrices = this.fundPriceData.filter(
        (x) =>
          x['Fund ID'] == data['Fund ID'] &&
          x['Fund price expiry date'] == data['Fund price expiry date'] &&
          x['Fund price effective date'] == data['Fund price effective date']
      );
      if (
        samePeriodFundPrices.length > 0 ||
        samePeriodFundPricesUploaded.length > 0
      ) {
        const errMessage = `There are multiple fund prices for the same same fund ID (${data['Fund ID']}) over the same fund effective period..`;
        throw new Error(errMessage);
      }

      this.uploadedFundPriceData.push(data);
    } catch (e) {
      this.uploadLoading = false;
      this.message = e;
      this.action = 'warning';
      this.showAlert = true;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this._success.next('opened');
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
        if (this.uploadedFundPriceData.length > 0) {
          this.fundService
            .saveFund(
              this.uploadedFundPriceData,
              this.fileName,
              'IG_ASSET_FUND_PRICE'
            )
            .subscribe((response) => {
              let funds = response['data'].map((x) => x.asset);
              this.fundPriceData.push(...funds);
              const message = 'Successfully Uploaded Fund Price';

              this.message = message;
              this.action = 'success';
              this.showAlert = true;
              this._success.next('opened');

              this.uploadLoading = false;
              this.labelImport.nativeElement.innerText = '';
              this.fileToUpload = null;
              this.loading = false;
              this.formImport.reset();
            });
        } else {
          const message =
            'Fund Price rows are empty.Please add fund price details';

          this.message = message;
          this.action = 'warning';
          this.showAlert = true;
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
          this._success.next('opened');
          // this
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
}
