import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GeneralConfiguration } from '@app/feature/planTemplate/model/generalConfiguration.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import {
  InitialDepositOptions,
  FeesChargesConfiguration,
} from '../../model/planIndex.model';
import { PlanService } from '../../services/plan.service';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';

@Component({
  selector: 'ignatica-plan-surrender',
  templateUrl: './plan-surrender.component.html',
  styleUrls: ['./plan-surrender.component.scss'],
})
export class PlanSurrenderComponent implements OnInit {
  @Input() initialDepositOptions: InitialDepositOptions;
  @Input() feesAndChargesOptions: any[] = [];
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() chargeType: string;
  @Input() feesChargesOID: string;
  @Input() ruleCategory: string;
  @Input() widgetCode: string;
  @Input() surrenderType: string;
  @Input() heading: string;
  @Input() planGuid: string = null;
  @Input() product: any;
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() disableControl: boolean = false;
  @Output() saveChargesFromChildEmit = new EventEmitter<object>();
  surrenderModules: any = [];
  selectedSurrenderModuleOID: any;
  selectedSurrenderModule: any;
  @Input() modulesEventsSubject: Observable<void>;
  eventsSubscription: Subscription;
  selectedSurrenderFormulaObj: any;

  constructor(
    private planService: PlanService,
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.planService.getCurrencyValue().subscribe((event) => {
      if (event) {
        this.initialDepositOptions.depositCurrencyOID = event;
      }
    });
    if (this.product.modules.length > 0) {
      this.surrenderModules = this.product.modules
        .filter((x) => x.widgetCode == this.widgetCode && x.isEnabled)
        .map((x) => {
          x['selected'] = false;
          return x;
        });
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
            prodEle.widgetCode === this.widgetCode &&
            prodEle.isEnabled
          ) {
            this.selectedSurrenderModuleOID = prodEle.moduleOID;
            this.selectedSurrenderModule = prodEle;
          }
        });
      });
    }
    this.eventsSubscription = this.modulesEventsSubject.subscribe(() => {
      if (
        this.surrenderModules.length > 0 &&
        !this.selectedSurrenderModuleOID
      ) {
        return;
      }
      if (this.selectedSurrenderModuleOID) {
        this.selectedSurrenderFormulaObj = {
          moduleOID: this.selectedSurrenderModuleOID,
          cronJobSettings: this.selectedSurrenderModule.cronJobSettings,
          isEnabled: true,
        };
        return;
      }
    });
  }

  saveChargesEmit(charges, chargeType) {
    this.saveChargesFromChildEmit.emit({ param1: charges, param2: chargeType });
  }

  getDataByType() {
    let charges = Array.prototype.concat.apply(
      [],
      this.feesAndChargesOptions
        .filter((x) => x.feesChargesOID == this.feesChargesOID)
        .map((x) => x.feesChargesRateTable)
    );
    return charges ? charges : [];
  }

  showFormulas() {
    this.surrenderModules = this.surrenderModules.map((x) => {
      x['selected'] = false;
      if (this.selectedSurrenderModuleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.surrenderModules;
    modalRef.componentInstance.selectedFormula = this.selectedSurrenderModule;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.heading = this.translateService.instant(
      `plan.${this.surrenderType}.configureFormula`
    );
    modalRef.closed.subscribe((data) => {
      this.selectedSurrenderModuleOID = data?.moduleOID;
      this.selectedSurrenderModule = data;
      this.surrenderModules = this.surrenderModules.map((x) => {
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
    modalRef.componentInstance.ruleCategory = this.ruleCategory;
    modalRef.componentInstance.heading = `plan.${this.surrenderType}.rulesTitle`;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == this.ruleCategory
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== this.ruleCategory
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
