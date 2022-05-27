/**
 * COI Premium Rate Widget it contains uploading rates and view rate.
 *
 * <p>
 * Former known as Premium Rate
 * <p>
 *
 * @author [RekhaG]
 *
 */

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import * as hash from 'object-hash';
import _ from 'lodash';
import * as moment from 'moment';
import { ToastService } from '@shared/custom/service/toast.service';
import { ConfirmModalComponent } from '@shared/custom/component/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '@shared/custom/component/modal/modal.service';
import { ImportCsvTableComponent } from '../../shared/import-csv-table/import-csv-table.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PlanService } from '../../../services/plan.service';
import { ProductTemplate } from '../../../../products/model/productTemplate.model';

@Component({
  selector: 'ignatica-plan-coi-rate',
  templateUrl: './plan-coi-rate.component.html',
  styleUrls: ['./plan-coi-rate.component.scss'],
})
export class PlanCoiRateComponent implements OnInit {
  @Input() heading: string = 'premium';
  @Input() disableControl: boolean = false;
  @Input() coiRateTableKeys = [];
  @Input() coiRateTableRows = [];
  @Output() coiRateChangesEmit = new EventEmitter<object>();
  @Input() product: ProductTemplate;
  fileToUpload: File = null;
  error = '';
  success = '';
  loading = false;
  uploadLoading = false;
  selectedAll = false;
  showInvalid = false;
  rateTableKeys = [];
  currentRowHashes: any = [];
  rowHashes: any = [];
  count = 0;
  summary = [];
  rateTabledData = [];
  filterRateTableData = [];
  rateTableCols = [];
  rowIndex = 0;
  olderFilterData = [];
  olderRateTableData = [];
  modalOptions: NgbModalOptions;
  isCollapsed: boolean = true;

  constructor(
    private papa: Papa,
    private translateService: TranslateService,
    public popupService: ModalService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private planService: PlanService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'ignatica-confirmation-modal',
    };
  }

  ngOnInit(): void {
    if (this.coiRateTableRows) {
      if (this.coiRateTableKeys && this.coiRateTableKeys.length > 0) {
        let colums = this.coiRateTableKeys;
        this.rateTableCols = ['selected', ...colums];
      }
      if (this.coiRateTableRows && this.coiRateTableRows.length > 0) {
        this.rateTabledData = this.coiRateTableRows;
        this.filterRateTableData = this.rateTabledData.filter((x) => {
          x['selected'] = false;
          return !x['isDeleted'];
        });
      }
    }
  }

  getColumnHeader(key: string) {
    switch (key) {
      case 'isActive':
        return 'Activate';
      case 'isDeleted':
        return 'Action';
      case 'rowGuid':
        return '#';
      default:
        return key;
    }
  }

  orderRateTableKeys() {
    let cols = this.rateTableCols.filter(
      (x) => x !== 'selected' && x !== 'isActive' && x !== 'isDeleted'
    );
    let updatedCols = ['selected', ...cols, 'isActive', 'isDeleted'];
    return updatedCols;
  }

  selectAllChange() {
    this.filterRateTableData.map((x) => {
      if (!x['isDeleted']) x['selected'] = this.selectedAll;
      return x;
    });
  }
  getSelectedCount() {
    return (
      this.filterRateTableData.filter((x) => x['selected']).length +
      ' selected/' +
      this.filterRateTableData.length +
      ' total'
    );
  }
  removeSelectedRows() {
    if (this.filterRateTableData.filter((x) => x['selected']).length <= 0) {
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
        //let rateData = [...this.filterRateTableData];
        for (var i = 0; i < this.filterRateTableData.length; i++) {
          if (this.filterRateTableData[i]['selected']) {
            this.filterRateTableData[i].isDeleted = true;
            //this.filterRateTableData.splice(index, 1);
            let rtIndex = this.rateTabledData.findIndex(
              (x) => x['id'] == this.filterRateTableData[i]['id']
            );
            let rowRate = this.rateTabledData.find(
              (x) => x['id'] == this.filterRateTableData[i]['id']
            );
            if (rtIndex && rowRate.rowGuid) {
              this.rateTabledData[rtIndex]['isDeleted'] = true;
            } else {
              this.rateTabledData.splice(rtIndex, 1);
              this.filterRateTableData.splice(i, 1);
              i--;
            }
          }
        }
        /* rateData.map((row, index) => {
          if (row['selected']) {
            row.isDeleted = true;
            //this.filterRateTableData.splice(index, 1);
            let rtIndex = this.rateTabledData.findIndex(
              (x) => x['id'] == row['id']
            );
            let rowRate = this.rateTabledData.find((x) => x['id'] == row['id']);
            if(rtIndex && rowRate.rowGuid){
              this.rateTabledData[rtIndex]['isDeleted'] = true;
              this.filterRateTableData[index]['isDeleted'] = true;
            }
            else{
              this.rateTabledData.splice(rtIndex,1);
              this.filterRateTableData.splice(index,1)
            } 
          }
          return row;
        });*/
        this.filterRateTableData = this.filterRateTableData.filter(
          (x) => !x['isDeleted']
        );
        this.rateTableCols =
          this.filterRateTableData.length <= 0 ? [] : this.rateTableCols;
        this.setSummarry();
      }
    });
  }
  batchActivate() {
    if (this.filterRateTableData.filter((x) => x['selected']).length <= 0) {
      this.toastService.show({
        title: 'Error',
        description: 'Please select at least a row',
        classname: 'warning',
      });
    } else if (
      this.filterRateTableData.filter((x) => x['selected'] && !x['isActive'])
        .length <= 0
    ) {
      this.toastService.show({
        title: 'Error',
        description: 'All selected rows are activated',
        classname: 'warning',
      });
    } else {
      const dialogRef = this.openDialog('plan.alertMessages.statusConfirm');
      dialogRef.closed.subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.filterRateTableData.map((row) => {
            if (row['selected']) {
              row.isActive = true;
              let index = this.rateTabledData.findIndex(
                (x) => x['id'] == row['id']
              );
              this.rateTabledData[index]['isActive'] = true;
            }
            return row;
          });
          this.setSummarry();
        }
      });
    }
  }

  batchDeactivate() {
    if (this.filterRateTableData.filter((x) => x['selected']).length <= 0) {
      this.toastService.show({
        title: 'Error',
        description: 'Please select at least a row',
        classname: 'warning',
      });
    } else if (
      this.filterRateTableData.filter((x) => x['selected'] && x['isActive'])
        .length <= 0
    ) {
      this.toastService.show({
        title: 'Error',
        description: 'All selected rows are deactivated',
        classname: 'warning',
      });
    } else {
      const dialogRef = this.openDialog('plan.alertMessages.statusConfirm');
      dialogRef.closed.subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.filterRateTableData.map((row) => {
            if (row['selected']) {
              row.isActive = false;
              let index = this.rateTabledData.findIndex(
                (x) => x['id'] == row['id']
              );
              this.rateTabledData[index]['isActive'] = false;
            }
            return row;
          });
          this.setSummarry();
        }
      });
    }
  }

  getRowIndex(deleted) {
    this.rowIndex = deleted ? 0 : this.rowIndex + 1;
    return this.rowIndex;
  }
  delete(index, id): void {
    const dialogRef = this.openDialog('plan.alertMessages.deleteConfirm');
    dialogRef.closed.subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.filterRateTableData.splice(index, 1);
        let rowIndex = this.rateTabledData.findIndex((x) => x['id'] == id);
        let row = this.rateTabledData.find((x) => x['id'] == id);
        if (rowIndex && row.rowGuid) {
          this.rateTabledData[rowIndex]['isDeleted'] = true;
        } else {
          this.rateTabledData.splice(rowIndex, 1);
        }
        this.setSummarry();
      }
    });
  }
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

  toggleIsActive(active, id) {
    let rowIndex = this.rateTabledData.findIndex((x) => x['id'] == id);
    this.rateTabledData[rowIndex]['isActive'] = active;
    this.setSummarry();
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
    this.olderFilterData = this.filterRateTableData.map((a) => ({ ...a }));
    this.olderRateTableData = this.rateTabledData.map((a) => ({ ...a }));
    this.papa.parse(this.fileToUpload, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      worker: true,
      step: this.stepHandler,
      complete: (result) => {
        this.selectedAll = false;
        this.rateTableCols = Object.keys(this.filterRateTableData[0]);
        this.uploadLoading = false;
        this.fileToUpload = null;
        this.setSummarry();
        this.isCollapsed = false;
      },
      error: (e) => {
        console.log('Error: ', e);
        this.uploadLoading = false;
      },
    });
  }
  setSummarry() {
    this.coiRateChangesEmit.emit({
      param1: this.rateTableCols.filter((e) => e !== 'selected'),
      param2: this.rateTabledData.map((x) => {
        delete x['selected'];
        return x;
      }),
    });
  }
  checkIfRequiredColumnsMissing(row): boolean {
    let output: boolean = true;
    try {
      const keysInRow = Object.keys(row);
      const formattedKeysInRow = keysInRow.map((key) => key.toLowerCase());
      ['rate', 'effective start date'].forEach((column) => {
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

  checkIfEmptyColumns(row: any): void {
    try {
      const keysInRow = Object.keys(row);
      keysInRow.forEach((key) => {
        if (
          (row[key] == '' && row[key] !== 0) ||
          (row[key] == undefined &&
            key.toLocaleLowerCase() !== 'effective end date' &&
            key.toLocaleLowerCase() !== 'amount')
        ) {
          const errMessage = `There are blanks under the ${key} column(Row ${
            this.count + 1
          })`;
          //this.error$.next(errMessage);
          this.filterRateTableData = this.olderFilterData.map((a) => ({
            ...a,
          }));
          this.rateTabledData = this.olderRateTableData.map((a) => ({ ...a }));
          throw new Error(errMessage);
        }
      });
    } catch (e) {
      console.log('[CsvParserService.checkIfEmptyColumns] Error: ', e);
      throw e;
    }
  }

  checkIfKeyDescriptionMissing(row: any): void {
    try {
      const keysInRow = Object.keys(row);
      keysInRow.forEach((key) => {
        if (-1 != key.indexOf('Key') && -1 == key.indexOf('Description')) {
          if (!keysInRow.includes(key + ' Description')) {
            const errMessage = `The description column(${key} Description) is missing`;
            //this.error$.next(errMessage);
            throw new Error(errMessage);
          }
        }
      });
    } catch (e) {
      console.log('[CsvParserService.checkIfKeyDescriptionMissing] Error: ', e);
      throw e;
    }
  }

  checkIfKeyMissing(row: any): void {
    try {
      const keysInRow = Object.keys(row);
      keysInRow.forEach((key) => {
        if (-1 != key.indexOf('Key') && -1 == key.indexOf('Description')) {
          let [label, _] = key.split('Description');
          label = label.trim();

          // Check if corresponding Key is present
          if (!(label in row)) {
            const errMessage = `${label} column is missing`;
            //this.error$.next(errMessage);
            throw new Error(errMessage);
          }
        }
      });
    } catch (e) {
      console.log('[CsvParserService.checkIfKeyMissing] Error: ', e);
      throw e;
    }
  }

  checkIfRateIsValid(row: any): void {
    try {
      const keysInRow = Object.keys(row);
      keysInRow.forEach((key) => {
        let formattedKey = key.toLowerCase();
        if ('rate' == formattedKey) {
          // check if value is non-numeric
          if ('number' != typeof row[key]) {
            const errMessage = `There is a non-numeric value in the ${key} column(Row ${
              this.count + 1
            })`;
            //this.error$.next(errMessage);
            throw new Error(errMessage);
          }

          // check if negative number
          /* if (row[key] < 0) {
           const errMessage = `There is a negative value in  the ${key} column(Row ${this.count + 1})`;
           //this.error$.next(errMessage);
           throw new Error(errMessage);
         }*/
        }
      });
    } catch (e) {
      console.log('[CsvParserService.checkIfRateIsValid] Error: ', e);
      throw e;
    }
  }

  checkIfEffectiveStartDateIsValid(row: any): void {
    try {
      const keysInRow = Object.keys(row);
      keysInRow.forEach((key) => {
        let formattedKey = key.toLowerCase();
        if ('effective start date' == formattedKey) {
          // check if value is not correct format
          const isValidFormat = moment(row[key], 'YYYY-MM-DD', true).isValid();

          if (!isValidFormat) {
            const errMessage = `The date format should be in YYYY-MM-DD format`;
            //this.error$.next(errMessage);
            throw new Error(errMessage);
          }
        }
      });
    } catch (e) {
      console.log(
        '[CsvParserService.checkIfEffectiveStartDateIsValid] Error: ',
        e
      );
      throw e;
    }
  }

  checkIfMoreColumns(row: any): void {
    try {
      const keysInRow = Object.keys(row).filter((key) => {
        return -1 != key.indexOf('Key') && -1 == key.indexOf('Description');
      });
      const summaryKeys = this.rateTableCols.filter(
        (x) =>
          x !== 'selected' &&
          x !== 'isActive' &&
          x !== 'isDeleted' &&
          x !== 'rowGuid' &&
          x !== 'id' &&
          x !== 'sourceFileName' &&
          x !== 'Rate' &&
          x.toLowerCase() !== 'effective start date' &&
          x.toLowerCase() !== 'effective end date' &&
          x.toLocaleLowerCase() !== 'amount'
      );
      if (summaryKeys.length <= 0) {
        return;
      }
      let newCols = [];
      keysInRow.forEach((key) => {
        const column = row[key + ' Description'];
        newCols.push(column);
      });
      let missingCols = newCols
        .concat(summaryKeys)
        .filter(
          (item) => !newCols.includes(item) || !summaryKeys.includes(item)
        );

      if (missingCols.length > 0) {
        const errMessage = `Columns ${JSON.stringify(
          missingCols
        )} are missing. Rate Structure varies.`;
        // this.error$.next(errMessage);
        throw new Error(errMessage);
      }
    } catch (e) {
      console.log('[CsvParserService.checkIfMoreColumns] Error: ', e);
      throw e;
    }
  }

  validateRow(row): any {
    // console.log('VALIDATING ROW: ', row)
    let data = {};
    try {
      const keysInRow = Object.keys(row);

      // Check if more columns are there
      this.checkIfMoreColumns(row);

      // Check if required columns are missing
      this.checkIfRequiredColumnsMissing(row);

      // Check if empty columns in any rows
      this.checkIfEmptyColumns(row);

      // Check if key description is missing
      this.checkIfKeyDescriptionMissing(row);

      // Check if key is missing
      this.checkIfKeyMissing(row);

      // Check if rate is valid
      this.checkIfRateIsValid(row);

      // Check if effective start date is valid
      this.checkIfEffectiveStartDateIsValid(row);
      return data;
    } catch (e) {
      console.log('[CsvParserService.validateRow] Error: ', e);
      throw e;
    }
  }

  checkDuplicateRow(row) {
    let clonedRow = Object.assign({}, row, {
      rowGuid: undefined,
      isActive: true,
      isDeleted: false,
      selected: false,
      sourceFileName: undefined,
      id: undefined,
    });
    for (let x of this.filterRateTableData) {
      let existingRow = Object.assign({}, x, {
        rowGuid: undefined,
        sourceFileName: undefined,
        id: undefined,
        selected: false,
      });
      if (_.isMatch(existingRow, clonedRow)) {
        const errMessage = `Duplicate rows detected - ${JSON.stringify(row)} `;
        this.toastService.show({
          title: 'Error',
          description: errMessage,
          classname: 'warning',
        });
        return null;
      }
    }
    const rowHash = hash(row);
    let newRow = {
      selected: false,
      id: rowHash,
      rowGuid: null,
      sourceFileName: this.fileToUpload.name,
      ...row,
    };
    newRow['isActive'] = true;
    newRow['isDeleted'] = false;
    return newRow;
  }
  prepareRowFromKeys(row): any {
    let formattedRow = {};
    try {
      const keysInRow = Object.keys(row);
      keysInRow.forEach((key) => {
        const formattedKey = key.toLowerCase();
        if (-1 != key.indexOf('Key') && -1 != key.indexOf('Description')) {
          //  Get value of key from key description
          let [label, _] = key.split('Description');
          label = label.trim();

          // Check if corresponding Key is present
          if (label in row) {
            formattedRow['' + row[key]] = row[label];
          }
        } else if (
          [
            'rate',
            'effective start date',
            'effective end date',
            'amount',
          ].includes(formattedKey)
        ) {
          formattedRow['' + key] = row[key];
        }
      });
    } catch (e) {
      console.log('[CsvParserService.prepareRowFromKeyData] Error: ', e);
      throw e;
    }

    return formattedRow;
  }

  prepareKeys(row): void {
    try {
      const summaryKeys = Object.keys(this.summary);
      // console.log('summaryKeys: ', summaryKeys);

      if (summaryKeys.length) {
        return;
      }
      const keys = Object.keys(row);
      keys.forEach((key) => {
        if (-1 !== key.indexOf('Description')) {
          this.rateTableKeys.push(row[key]);
          this.summary.push(row[key]);
        }
      });
    } catch (e) {
      console.log('[CsvParserService.prepareKeys] Error: ', e);
      throw e;
    }
  }

  stepHandler = ({ data }) => {
    try {
      this.prepareKeys(data);
      this.validateRow(data);
      const row = this.prepareRowFromKeys(data);
      let uniqueRow = this.checkDuplicateRow(row);
      if (uniqueRow) {
        this.rateTabledData.push(uniqueRow);
        this.filterRateTableData.push(uniqueRow);
        this.count++;
      }
    } catch (e) {
      this.uploadLoading = false;
      this.toastService.show({
        title: 'Error',
        description: e,
        classname: 'warning',
      });
      console.log('[CsvParserService.stepHandler] Error: ', e);
      this.fileToUpload = null;
      throw e;
    }
  };

  uploadCsv() {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      scrollable: false,
    };
    const data = {
      title: `Import ${this.heading} Rate`,
      subTitle: `Import ${this.translateService.instant(
        this.heading
      )} rate table from CSV file`,
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
        this.import();
      }
    });
  }

  downloadSampleCSV() {
    const templateData = {
      data: [
        {
          Key1: '1',
          'Key1 Description': 'Age',
          Key2: 'M',
          'Key2 Description': 'Gender',
          Rate: '0.001083525',
          'Effective Start Date': '2021-01-01',
          'Effective End Date': '2021-01-31',
        },
      ],
    };
    this.planService.downloadSampleCSV('Rate Table Sample.csv', templateData);
  }
}
