import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AdminService } from '@app/master-management/service/admin.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from '@shared/custom/component/confirm-modal/confirm-modal.component';
import { ModalService } from '@shared/custom/component/modal/modal.service';
import { Papa } from 'ngx-papaparse';
import { State } from '../../../model/state';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, retry } from 'rxjs/operators';
import { UploadQuestionnaireComponent } from '../../underwriting/upload-questionnaire/upload-questionnaire.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ignatica-uw-questionnaire',
  templateUrl: './uw-questionnaire.component.html',
  styleUrls: ['./uw-questionnaire.component.scss'],
})
export class UwQuestionnaireComponent implements OnInit {
  fileToUpload: File = null;
  tableHeaders: any = ['#', 'Activate', 'Question', 'Type', 'Action'];
  editTableHeaders: any = ['AddRemove', 'Condition', 'Arrows', 'Action'];
  underwritingData: any = [];
  underwritingTableData: any = [];
  dataTypesAllowed: any = ['Numeric', 'List'];
  globalActions: any = ['Pass', 'Reject', 'Referral', 'Null'];
  fileName: string = '';
  modalOptions: NgbModalOptions;
  showAlert: boolean = false;
  action: string = 'warning';
  message: any = [];
  dismissible: boolean = false;
  private _success = new Subject<string>();
  errMessages: any = [];
  total: number = 10;

  _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: null,
    sortColumn: 'question',
    sortDirection: 'asc',
  };
  searchChanged = new Subject<string>();
  public removeEventListener: () => void;

  constructor(
    public popupService: ModalService,
    private papa: Papa,
    private adminService: AdminService,
    private modalService: NgbModal,
    private translateService: TranslateService,
    protected _sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.fetchUnderwritingData();
    this.modalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'ignatica-confirmation-modal',
    };
    this.searchChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.fetchUnderwritingData(this._state.searchTerm);
      });
  }
  pageChanged(page) {
    this._state.page = page;
    this.fetchUnderwritingData();
  }
  pageSizeChanged(e, pageSize) {
    this._state.pageSize = e;
    this.fetchUnderwritingData();
  }

  ngOnInit(): void {
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      this.showAlert = false;
    });
  }
  getKeys(key) {
    return key === 'Question'
      ? 'question'
      : key === 'Type'
      ? 'questionType'
      : key === 'Answer'
      ? 'answers'
      : undefined;
  }
  uploadCsv() {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      scrollable: false,
    };
    const data = {
      title: 'Import CSV',
      subTitle: 'Import underwriting questions from CSV file',
      labels: {
        button: {
          first: 'Cancel',
          second: 'Upload',
        },
      },
    };
    const modalRef = this.popupService.open(
      UploadQuestionnaireComponent,
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

  stepHandler = ({ data }) => {
    try {
      this.showAlert = false;

      let keys = Object.keys(data);
      const noOfActions = keys.filter((k) => k.indexOf('Action') != -1).length;
      const noOfConditions = keys.filter(
        (k) => k.indexOf('Condition') != -1
      ).length;

      // The Type should be at two possible values ‘Numeric’ or ‘List’, otherwise, prompt error “Invalid type defined.”
      if (!this.dataTypesAllowed.includes(data.Type)) {
        this.errMessages.push(`Invalid type defined.`);
      }

      // The answer format check
      if (
        (data.Type === 'Numeric' && data.Answer !== 'Null') ||
        (data.Type === 'List' && data.Answer.indexOf('[') === -1)
      ) {
        this.errMessages.push(`Invalid answer format.`);
      } else if (data.Type === 'List' && data.Answer.indexOf('[') === -1) {
        this.errMessages.push(`Invalid answer format.`);
      }

      // The Condition(s) and Action(s) column should be shown in pair next to each others.
      if (noOfActions !== noOfConditions) {
        this.errMessages.push(`Invalid Header column(s).`);
      }

      if (!this.errMessages.length) {
        let caRulesArray = [];

        for (let i = 1; i <= noOfActions; i++) {
          let obj = {};
          if (data['Condition ' + i].indexOf('..') > -1) {
            obj['condition' + i] = {};
            obj['condition' + i]['min'] = parseInt(
              data['Condition ' + i].split('..')[0]
            );
            obj['condition' + i]['max'] = parseInt(
              data['Condition ' + i].split('..')[1]
            );
            obj['condition' + i]['conditionType'] = 'Range';
          } else if (data['Condition ' + i] !== 'Null') {
            obj['condition' + i] = data['Condition ' + i];
          }
          if (data['Action ' + i] !== 'Null') {
            obj['action' + i] = data['Action ' + i];
          }
          if (Object.keys(obj).length) {
            caRulesArray.push(obj);
          }
        }

        let uData = {
          question: data.Question,
          questionType: data.Type,
          answers:
            data.Type == 'List'
              ? data.Answer.replace('[', '').replace(']', '').trim().split(',')
              : data.Answer,
          source: this.fileName,
          caRules: caRulesArray,
          isActive: true,
          isRequired: true,
        };
        this.underwritingData.push(uData);
      }
    } catch (e) {
      throw e;
    }
  };

  import(): void {
    this.showAlert = false;
    this.message = '';
    this.errMessages = [];

    this.papa.parse(this.fileToUpload, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      worker: true,
      step: this.stepHandler,
      complete: (result) => {
        if (this.errMessages.length) {
          this.showAlert = true;
          this.action = 'danger';
          this.errMessages.unshift("<p class='mb-0'>File not imported.</p>");
          this.errMessages.push(
            "<p class='mb-0 mt-2'>Please consider to <a id='lnkDownloadCsv' class='pointer'>download</a> standard underwriting CSV file.</p>"
          );
          this.message = this.errMessages.join('<br />');
          this.dismissible = true;

          // Adding click event as anchor element is appended after page load
          this.removeEventListener = this.renderer.listen(
            this.elementRef.nativeElement,
            'click',
            (event) => {
              if (event.target.id === 'lnkDownloadCsv') {
                this.downloadCsv();
              }
            }
          );
        } else if (this.underwritingData.length > 0) {
          let payload: any = {};
          payload.questionnaire = this.underwritingData;
          payload.userName = localStorage.getItem('currentUser');
          this.adminService.saveUnderwritingQuestionnaire(payload).subscribe(
            (response) => {
              this.fetchUnderwritingData();

              this.showAlert = true;
              this.message = 'Underwriting questions imported';
              this.action = 'success';
              this.dismissible = true;
            },
            (error) => {
              this.showAlert = true;
              this.message = 'File not imported.';
              this.action = 'danger';
              this.dismissible = true;
            }
          );
        }
      },
      error: (e) => {
        console.log('Error: ', e);
      },
    });
  }

  onSearch() {
    this.searchChanged.next(this._state.searchTerm);
  }

  fetchUnderwritingData(searchKey?: string) {
    this.adminService
      .getUnderwritingQuestionnaire(
        this._state.page,
        this._state.pageSize,
        searchKey
      )
      .subscribe((response: any) => {
        this.underwritingTableData = response.data;
        this.total = response.count;
      });
  }

  getRangeData(row) {
    return row.min + '..' + row.max;
  }
  updateRangeData(event, row) {
    row.min = parseInt(event.target.value.split('..')[0]);
    row.max = parseInt(event.target.value.split('..')[1]);
  }
  onSubmit() {
    let payload: any = {};
    payload.userName = localStorage.getItem('currentUser');
    let underwritingTableDataObj = Object.assign(
      [],
      this.underwritingTableData
    );
    underwritingTableDataObj.forEach((element) => {
      delete element.isEdit;
    });
    payload.questionnaire = underwritingTableDataObj;
    this.adminService
      .updateUnderwritingQuestionnaire(payload)
      .subscribe((response: any) => {
        if (response.success) {
          this.fetchUnderwritingData();

          this.showAlert = true;
          this.message = 'Underwriting questionnaire Updated Successfully.';
          this.action = 'success';
          this._success.next('opened');
        } else {
          this.showAlert = true;
          this.message = response.msg;
          this.action = 'danger';
          this.dismissible = true;
        }
      });
  }

  toggleIsActive(row) {
    if (!row.isRequired) {
      const modalRef = this.modalService.open(
        ConfirmModalComponent,
        this.modalOptions
      );
      modalRef.componentInstance.data = {
        title: 'Are you sure?',
        message:
          'This question will not be available for selection for plans in the future.',
        confirmBtnText: this.translateService.instant('plan.alertMessages.yes'),
        cancelBtnText: this.translateService.instant('plan.alertMessages.no'),
      };
      modalRef.closed.subscribe((data) => {
        row.isRequired = !data;
      });
    }
  }
  addCondition(row) {
    let newRow = {};
    if (row.questionType === 'Numeric') {
      newRow['action' + (row.caRules.length + 1)] = '';
      newRow['condition' + (row.caRules.length + 1)] = {
        conditionType: 'Range',
        max: 0,
        min: 0,
      };
    } else if (row.questionType === 'List') {
      newRow['action' + (row.caRules.length + 1)] = '';
      newRow['condition' + (row.caRules.length + 1)] = '';
    }

    row.caRules.push(newRow);
  }

  removeCondition(row, index) {
    console.log('caRules after removing : ' + JSON.stringify(row[index]));

    let i = index;
    while (row.length - i - 1) {
      row[i]['action' + (i + 1)] = row[i + 1]['action' + (i + 2)];
      row[i]['condition' + (i + 1)] = row[i + 1]['condition' + (i + 2)];

      i++;
    }
    row.pop();
    console.log(JSON.stringify(row));
  }

  downloadCsv() {
    this.adminService.downloadUnderwritingTemplate('UnderWriting.csv');
  }

  safeHtml(html) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  downloadAllQuestions() {
    let underwritingTableDataObj = Object.assign(
      [],
      this.underwritingTableData
    );
    let csvData = [];
    let csvHeaders = ['Question', 'Type', 'Answer'];
    underwritingTableDataObj.forEach((obj) => {
      let temp = {};
      temp['Question'] = obj[this.getKeys('Question')];
      temp['Type'] = obj[this.getKeys('Type')];
      temp['Answer'] = obj[this.getKeys('Answer')];

      obj.caRules.forEach((rule) => {
        Object.keys(rule).forEach((ele) => {
          if (
            !csvHeaders.includes(
              ele
                .replace('action', 'Action ')
                .replace('condition', 'Condition ')
            )
          ) {
            csvHeaders.push(
              ele
                .replace('action', 'Action ')
                .replace('condition', 'Condition ')
            );
          }
          if (temp['Type'] === 'Numeric') {
            if (ele.includes('condition')) {
              if (rule[ele]['conditionType'] === 'Range') {
                temp[ele.replace('condition', 'Condition ')] =
                  rule[ele].min + '..' + rule[ele].max;
              }
            } else if (ele.includes('action')) {
              temp[ele.replace('action', 'Action ')] = rule[ele];
            }
          } else {
            temp[
              ele
                .replace('action', 'Action ')
                .replace('condition', 'Condition ')
            ] = rule[ele];
          }
        });
      });

      csvData.push(temp);
    });
    this.adminService.downloadUnderwritingTemplate('UnderWriting.csv', {
      fields: csvHeaders,
      data: csvData,
    });
  }
}
