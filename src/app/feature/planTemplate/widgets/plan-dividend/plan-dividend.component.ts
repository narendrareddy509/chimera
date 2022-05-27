import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GeneralConfiguration } from '@app/feature/planTemplate/model/generalConfiguration.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import {
  ParticipatingPlan,
  FeesChargesConfiguration,
  CashWithdrawalOptions,
} from '../../model/planIndex.model';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';

@Component({
  selector: 'ignatica-plan-dividend',
  templateUrl: './plan-dividend.component.html',
  styleUrls: ['./plan-dividend.component.scss'],
})
export class PlanDividendComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() ruleCategory: string;
  @Input() product: any;
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() disableControl: boolean = false;
  @Input() participatingPlan: ParticipatingPlan;
  @Input() cashWithdrawalOptions: CashWithdrawalOptions;
  modules = [];
  eventsSubscription: Subscription;
  selectedSurrenderFormulaObj: any;
  selectedEndowmentModuleOID: any;
  selectedEndowmentModule: any;
  @Input() eventsSubject: Observable<void>;

  constructor(
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.product.modules.length > 0) {
      this.modules = this.product.modules
        .filter((x) => x.widgetCode == 'plan-endowment' && x.isEnabled)
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
            prodEle.widgetCode === 'plan-endowment' &&
            prodEle.isEnabled
          ) {
            this.selectedEndowmentModuleOID = prodEle.moduleOID;
            this.selectedEndowmentModule = prodEle;
          }
        });
      });
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      if (this.modules.length > 0 && !this.selectedEndowmentModuleOID) {
        return;
      }
      if (this.selectedEndowmentModuleOID) {
        this.selectedSurrenderFormulaObj = {
          moduleOID: this.selectedEndowmentModuleOID,
          cronJobSettings: this.selectedEndowmentModule.cronJobSettings,
          isEnabled: true,
        };
        return;
      }
    });
  }

  showFormulas() {
    this.modules = this.modules.map((x) => {
      x['selected'] = false;
      if (this.selectedEndowmentModuleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.modules;
    modalRef.componentInstance.selectedFormula = this.selectedEndowmentModule;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.heading = this.translateService.instant(
      `plan.endowment.configureFormula`
    );
    modalRef.closed.subscribe((data) => {
      this.selectedEndowmentModuleOID = data?.moduleOID;
      this.selectedEndowmentModule = data;
      this.modules = this.modules.map((x) => {
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
    modalRef.componentInstance.heading = `plan.endowment.rulesTitle`;
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
