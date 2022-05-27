import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import {
  FeesChargesConfiguration,
  PlanRateTable,
  GeneralConfiguration,
} from '../../model/planIndex.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { RenewalOptions } from '../../model/renewal.model';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-plan-renewal-formula',
  templateUrl: './plan-renewal-formula.component.html',
  styleUrls: ['./plan-renewal-formula.component.scss'],
})
export class PlanRenewalFormulaComponent implements OnInit {
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() product: any;
  @Input() disableControl: boolean = false;
  renewalPremiumFormulas: any;
  @Input() renewalOptions: RenewalOptions;
  @ViewChild('RFForm') RFForm: NgForm;
  eventsSubscription: Subscription;
  @Input() eventsSubject: Observable<void>;
  saveClicked = false;
  formValid = true;
  ageCalculationOptions: any;
  ageCalculationMethod: any;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  renewalRateTableKeys = [];
  renewalRateTableRows = [];
  tableGuid: string = null;
  @Input() action: string;
  @Input() formulaText: string = 'Premium Adjustment Options';
  renewalFormulaOptions: any = [];
  renewalFormulaSelectedOID: any;
  renewalFormulaSelected: any;
  selectedRenewalFormulaObj: any;

  constructor(
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.product) {
      if (this.product.modules.length > 0) {
        this.renewalPremiumFormulas = this.product.modules
          .filter((x) => x.widgetCode == 'plan-renewal' && x.isEnabled)
          .map((x) => {
            x['selected'] = false;
            return x;
          });
      }
    }
    if (
      this.generalConfiguration &&
      this.generalConfiguration.planModules &&
      this.generalConfiguration.planModules.length > 0
    ) {
      this.generalConfiguration.planModules.forEach(async (planEle) => {
        this.product.modules.findIndex((prodEle) => {
          if (
            prodEle.moduleOID === planEle.moduleOID &&
            prodEle.widgetCode === 'plan-renewal' &&
            prodEle.isEnabled
          ) {
            this.renewalFormulaSelectedOID = prodEle.moduleOID;
            this.renewalFormulaSelected = prodEle;
          }
        });
      });
    }
    let tableRenewal = this.feesChargesConfiguration.premiumOptions.filter(
      (x) => x.tableName == 'premium-renewal-term-life'
    );
    if (
      this.feesChargesConfiguration.premiumOptions.length > 0 &&
      tableRenewal.length > 0
    ) {
      let renewalPremiumOptions = tableRenewal[0].tableRows;
      this.tableGuid = tableRenewal[0].tableGuid;
      if (renewalPremiumOptions.length > 0) {
        let renewalKeys: any = Object.keys(
          renewalPremiumOptions[0]['rateTable']
        );
        this.renewalRateTableKeys = [
          'rowGuid',
          'sourceFileName',
          'Effective Start Date',
          'Effective End Date',
          'Rate',
          'id',
          'isActive',
          'isDeleted',
        ].concat(renewalKeys);
        this.renewalRateTableRows = renewalPremiumOptions
          .filter((x) => !x.isDeleted)
          .map((x) => {
            let rateTable = {
              rowGuid: x['rowGuid'],
              sourceFileName: x['sourceFileName'],
              'Effective Start Date': x['effectiveStartDate']
                ? moment(x['effectiveStartDate']).format('YYYY-MM-DD')
                : x['effectiveStartDate'],
              'Effective End Date': x['effectiveEndDate']
                ? moment(x['effectiveEndDate']).format('YYYY-MM-DD')
                : x['effectiveEndDate'],
              Rate: x['rate'],
              id: x['rowGuid'],
              isActive: x['isActive'],
              isDeleted: x['isDeleted'],
            };
            renewalKeys.forEach((key) => {
              rateTable[key] = x['rateTable'][key];
            });
            return rateTable;
          });
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.saveClicked = true;
      let rateTableKeys = this.renewalRateTableKeys.filter(
        (x) =>
          x !== 'Rate' &&
          x !== 'isActive' &&
          x !== 'isDeleted' &&
          x !== 'rowGuid' &&
          x !== 'id' &&
          x !== 'sourceFileName' &&
          x.toLocaleLowerCase() !== 'effectivestartdate' &&
          x.toLocaleLowerCase() !== 'effectiveenddate' &&
          x.toLocaleLowerCase() !== 'effective start date' &&
          x.toLocaleLowerCase() !== 'effective end date'
      );
      let sourceFileName;
      //Structured in this form of API input
      let renewalPremiumRateTableRows = this.renewalRateTableRows
        //.filter((x) => !x.isDeleted)
        .map((x) => {
          sourceFileName = x['sourceFileName'];
          let premiumOption: any = {
            rowGuid:
              this.action == 'new' || this.action == 'clone'
                ? null
                : x['rowGuid'],
            effectiveStartDate: new Date(x['Effective Start Date'])
              .toISOString()
              .replace('Z', '+0000'),
            effectiveEndDate: x['Effective End Date']
              ? new Date(x['Effective End Date'])
                  .toISOString()
                  .replace('Z', '+0000')
              : undefined,
            rate: x['Rate'],
            amount: 0,
            isActive: x['isActive'],
            isDeleted: x['isDeleted'],
          };
          premiumOption['rateTable'] = {};
          rateTableKeys.forEach((key) => {
            premiumOption['rateTable'][key] = x[key];
          });
          return premiumOption;
        });
      let planRateTable: PlanRateTable = {
        tableGuid:
          this.action == 'new' || this.action == 'clone'
            ? null
            : this.tableGuid,
        tableName: 'premium-renewal-term-life',
        tableRows: renewalPremiumRateTableRows,
        sourceFileName: sourceFileName,
        isActive: true,
        isDeleted: false,
      };
      let index = this.feesChargesConfiguration.premiumOptions.findIndex(
        (x) => x.tableName == 'premium-renewal-term-life'
      );
      this.feesChargesConfiguration.premiumOptions[
        index == -1
          ? this.feesChargesConfiguration.premiumOptions.length
          : index
      ] = planRateTable;
      if (this.renewalPremiumFormulas.length <= 0) {
        this.formValid = true;
        return;
      }
      if (this.renewalFormulaSelectedOID) {
        this.selectedRenewalFormulaObj = {
          moduleOID: this.renewalFormulaSelectedOID,
          cronJobSettings: this.renewalFormulaSelected.cronJobSettings,
          isEnabled: true,
        };
        return;
      }

      this.formValid = this.RFForm.valid;
    });
  }

  renewalRateChangesEmit(rateKeys, rateData) {
    this.renewalRateTableKeys = rateKeys;
    this.renewalRateTableRows = rateData;
  }

  getAgeCalculationFormulas() {
    this.ageCalculationOptions = this.product.defaultFormulas.filter(
      (formula) => formula.code.includes('IG_CAL_AGE_')
    );
  }

  showFormulas() {
    this.renewalPremiumFormulas = this.renewalPremiumFormulas.map((x) => {
      x['selected'] = false;
      if (this.renewalFormulaSelectedOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.renewalPremiumFormulas;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.selectedFormula = this.renewalFormulaSelected;
    modalRef.componentInstance.heading =
      this.translateService.instant('plan.renewal.title');
    modalRef.closed.subscribe((data) => {
      this.renewalFormulaSelectedOID = data?.moduleOID;
      this.renewalFormulaSelected = data;
      this.renewalPremiumFormulas = this.renewalPremiumFormulas.map((x) => {
        x['selected'] = false;
        if (data?.moduleOID == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      });
    });
  }

  showUnderwritingRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = 'IG_RULE_CATEGORY_RENEWAL';
    modalRef.componentInstance.heading = 'plan.renewal.rulesTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_RENEWAL'
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_RENEWAL'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
