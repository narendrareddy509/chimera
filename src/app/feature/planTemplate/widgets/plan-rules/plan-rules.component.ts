import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  Underwriting,
  UnderwritingLoading,
} from '@app/feature/planTemplate/model/underwriting.model';
import {
  ProductTemplate,
  underwritingQuestions,
} from '../../../products/model/productTemplate.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@shared/custom/component/modal/modal.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FeesChargesConfiguration } from '../../model/feesChargesConfiguration.model';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-plan-rules',
  templateUrl: './plan-rules.component.html',
  styleUrls: ['./plan-rules.component.scss'],
})
export class PlanRulesComponent implements OnInit {
  @Input() underwriting: Underwriting;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() heading = 'Underwriting';
  @Input() product: ProductTemplate;

  @Input() disableControl: boolean = false;
  @Input() eventsSubject: Observable<any>;
  @ViewChild('UWForm') UWForm: NgForm;
  saveClicked = false;
  eventsSubscription: Subscription;
  formValid = false;
  underwritingCategories = ['medical', 'nonMedical'];
  renewalPremiumAdjustment = [];
  fileToUpload: File = null;
  tableHeaders: any = ['#', 'Assign', 'Questions'];
  editTableHeaders: any = ['AddRemove', 'Condition', 'Arrows', 'Action'];
  underwritingData: any = [];
  underwritingQuestionsList: underwritingQuestions[] = [];
  dataTypesAllowed: any = ['Numeric', 'List'];
  globalActions: any = ['Pass', 'Reject', 'Referral', 'Null'];
  ruleCategories = ['IG_RULE_CATEGORY_PREMIUM'];
  fileName: string = '';
  disableExtraLoading = true;

  modalOptions: NgbModalOptions;
  showAlert: boolean = false;
  action: string = 'warning';
  message: any = [];
  dismissible: boolean = false;
  private _success = new Subject<string>();

  errMessages: any = [];

  total: number = 10;

  _state: any = {
    page: 1,
    pageSize: 10,
    searchTerm: null,
    sortColumn: 'questions',
    sortDirection: 'asc',
  };

  searchChanged = new Subject<string>();
  public removeEventListener: () => void;
  isCollapsed: boolean = true;
  actionDetail: void;
  constructor(
    public popupService: ModalService,
    protected _sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) {
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

  ngOnInit(): void {
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      this.showAlert = false;
    });
    if (this.underwriting && !this.underwriting.underwritingLoading) {
      this.underwriting.underwritingLoading = [];
      const obj = new UnderwritingLoading();
      obj.isEnabled = false;
      obj.maxLoadingPercentage = 0;
      obj.loadingCategory = '';
      this.underwriting.underwritingLoading.push(obj);
    }
    this.eventsSubscription = this.eventsSubject.subscribe((data) => {
      if (data === 'publish') {
        this.saveClicked = true;
      }
      //Adding underwriting questions to plan
      if (!this.underwriting.questions) {
        this.underwriting.questions = [];
      }

      if (
        this.underwritingQuestionsList &&
        this.underwritingQuestionsList.length > 0
      ) {
        const selectedQuestions = this.underwritingQuestionsList.filter(
          (x: underwritingQuestions) => x.required
        );
        this.underwriting.questions = [];
        if (selectedQuestions.length > 0) {
          const selectedQuestionList = selectedQuestions.map((x) => {
            return {
              questionOID: x.questionOID,
              isEnabled: true,
            };
          });

          this.underwriting.questions = selectedQuestionList;
        }
      }

      // No inputs will be shown for cyber insurance, hence skipping validation
      this.formValid =
        this.product.screenCode !== 'vzfnlwep'
          ? this.UWForm.valid &&
            this.underwriting.minPolicyOwnerAge <=
              this.underwriting.maxPolicyOwnerAge
          : true;
    });
    this.fetchUnderwritingData();
  }
  getKeys(key) {
    return key === 'Questions'
      ? 'question'
      : key === 'Type'
      ? 'questionType'
      : key === 'Answer'
      ? 'answers'
      : undefined;
  }

  onSearch() {
    this.searchChanged.next(this._state.searchTerm);
  }

  fetchUnderwritingData(searchKey?: string) {
    this.underwritingQuestionsList = this.product.underwritingQuestions;
    if (this.underwriting.questions && this.underwriting.questions.length > 0) {
      this.underwritingQuestionsList.forEach((x: underwritingQuestions) => {
        x.required = this.underwriting.questions
          .map((y) => y.questionOID)
          .includes(x.questionOID);
      });
    }
  }
  getRangeData(row) {
    return row.min + '..' + row.max;
  }

  showUnderwritingRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = this.ruleCategories;
    modalRef.componentInstance.heading = `plan.underwriting.underwritingRules.title`;
    modalRef.componentInstance.subCategories = [
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_PREMIUM',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_CALCULATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Modifier'],
        category: 'IG_RULE_CATEGORY_PREMIUM',
      },
    ];
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter((x) =>
        this.ruleCategories.includes(x.ruleCategory)
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => !this.ruleCategories.includes(x.ruleCategory)
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
