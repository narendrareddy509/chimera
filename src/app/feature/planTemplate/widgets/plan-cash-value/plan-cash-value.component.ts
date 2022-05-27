/**
 * Cash Value Widget which contains cash value module selection, cash value summary and cash value upload rate .
 *
 * @author [Narendrareddy CH]
 */
import { Component, Input, OnInit } from '@angular/core';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  FeesChargesConfiguration,
  PlanRateTable,
} from '../../model/feesChargesConfiguration.model';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-plan-cash-value',
  templateUrl: './plan-cash-value.component.html',
  styleUrls: ['./plan-cash-value.component.scss'],
})
export class PlanCashValueComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  @Input() planModules: any;
  @Input() action: string;
  cashValueSelectedModule: any;
  cashValueSelectedModuleOID: any;
  cashValueSelectedModuleObject: any;
  cashValueEventsSubject: Subject<void> = new Subject<void>();
  cashValueRateTableKeys = [];
  cashValueRateTableRows = [];
  tableGuid: string = null;
  cashValueModules: any = [];
  saveClicked = false;
  eventsSubscription: Subscription;

  constructor(
    private translateService: TranslateService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.product.modules.length > 0) {
      this.cashValueModules = this.product.modules
        .filter((x) => x.widgetCode == 'plan-cash-value' && x.isEnabled)
        .map((x) => {
          x['selected'] = false;
          return x;
        });
      let cashValueMouleOids = this.cashValueModules.map((x) => x.moduleOID);
      if (
        this.planModules.filter(
          (x) => cashValueMouleOids.indexOf(x.moduleOID) > -1
        ).length > 0
      ) {
        this.cashValueSelectedModuleObject = this.product.modules.filter(
          (x) => cashValueMouleOids.indexOf(x.moduleOID) > -1
        )[0];
        this.cashValueSelectedModuleOID =
          this.cashValueSelectedModuleObject?.moduleOID;
        this.cashValueSelectedModule = this.cashValueSelectedModuleObject;
      }
    }
    if (this.planModules.length > 0) {
      let cashValueMouleOids = this.cashValueModules.map((x) => x.moduleOID);
      if (
        this.planModules.filter(
          (x) => cashValueMouleOids.indexOf(x.moduleOID) > -1
        ).length > 0
      ) {
        this.cashValueSelectedModule = this.product.modules.filter(
          (x) => cashValueMouleOids.indexOf(x.moduleOID) > -1
        )[0];
        this.cashValueSelectedModuleOID =
          this.cashValueSelectedModule.moduleOID;
      }
    }
    let tableCashValue = this.feesChargesConfiguration.premiumOptions.filter(
      (x) => x.tableName == 'premium-cash-value'
    );
    if (
      this.feesChargesConfiguration.premiumOptions.length > 0 &&
      tableCashValue.length > 0
    ) {
      let cashValueOptions = tableCashValue[0].tableRows;
      this.tableGuid = tableCashValue[0].tableGuid;
      if (cashValueOptions.length > 0) {
        let cashValueKeys: any = Object.keys(cashValueOptions[0]['rateTable']);
        this.cashValueRateTableKeys = [
          'rowGuid',
          'sourceFileName',
          'Effective Start Date',
          'Rate',
          'id',
          'isActive',
          'isDeleted',
        ].concat(cashValueKeys);
        this.cashValueRateTableRows = cashValueOptions.map((x) => {
          let rateTable = {
            rowGuid: x['rowGuid'],
            sourceFileName: x['sourceFileName'],
            'Effective Start Date': x['effectiveStartDate']
              ? moment(x['effectiveStartDate']).format('YYYY-MM-DD')
              : x['effectiveStartDate'],
            Rate: x['rate'],
            id: x['rowGuid'],
            isActive: x['isActive'],
            isDeleted: x['isDeleted'],
          };
          cashValueKeys.forEach((key) => {
            rateTable[key] = x['rateTable'][key];
          });
          return rateTable;
        });
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      let rateTableKeys = this.cashValueRateTableKeys.filter(
        (x) =>
          x !== 'Rate' &&
          x !== 'isActive' &&
          x !== 'isDeleted' &&
          x !== 'rowGuid' &&
          x !== 'id' &&
          x !== 'sourceFileName' &&
          x.toLocaleLowerCase() !== 'effectivestartdate' &&
          x.toLocaleLowerCase() !== 'effective start date'
      );
      let sourceFileName;
      //Structured in this form of API input
      let cashValueRateTableRows = this.cashValueRateTableRows
        .filter((x) => !x.isDeleted)
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
            rate: x['Rate'],
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
        tableName: 'premium-cash-value',
        tableRows: cashValueRateTableRows,
        sourceFileName: sourceFileName,
        isActive: true,
        isDeleted: false,
      };
      let index = this.feesChargesConfiguration.premiumOptions.findIndex(
        (x) => x.tableName == 'premium-cash-value'
      );
      this.feesChargesConfiguration.premiumOptions[
        index == -1
          ? this.feesChargesConfiguration.premiumOptions.length
          : index
      ] = planRateTable;
      if (this.cashValueSelectedModuleOID) {
        this.cashValueSelectedModuleObject = {
          moduleOID: this.cashValueSelectedModuleOID,
          cronJobSettings: this.cashValueSelectedModuleOID.cronJobSettings,
          isEnabled: true,
        };
      }
    });
  }
  cashValueRateChangesEmit(rateKeys, rateData) {
    this.cashValueRateTableKeys = rateKeys;
    this.cashValueRateTableRows = rateData;
  }
  showFormulas() {
    this.cashValueModules = this.cashValueModules.map((x) => {
      x['selected'] = false;
      if (this.cashValueSelectedModuleObject?.moduleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.cashValueModules;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.selectedFormula =
      this.cashValueSelectedModuleObject;

    modalRef.componentInstance.heading = this.translateService.instant(
      'plan.cashValue.formulasTitle'
    );
    modalRef.closed.subscribe((data) => {
      this.cashValueSelectedModule = data;
      this.cashValueSelectedModuleOID = data?.moduleOID;
      this.cashValueModules = this.cashValueModules.map((x) => {
        x['selected'] = false;
        if (data?.moduleOID == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      });
    });
  }

  showRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = 'IG_RULE_CATEGORY_CASH_VALUE';
    modalRef.componentInstance.heading = 'plan.cashValue.rulesTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_CASH_VALUE'
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_CASH_VALUE'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
