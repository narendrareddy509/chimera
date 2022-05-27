import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import {
  FeesChargesConfiguration,
  GeneralConfiguration,
  InitialDepositOptions,
} from '../../model/planIndex.model';
import { PlanService } from '../../services/plan.service';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-plan-cancellation',
  templateUrl: './plan-cancellation.component.html',
  styleUrls: ['./plan-cancellation.component.scss'],
})
export class PlanCancellationComponent implements OnInit {
  @Input() feesAndChargesOptions: any[] = [];
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() ruleCategory: string;
  @Input() widgetCode: string;
  @Input() planGuid: string = null;
  @Input() product: any;
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() disableControl: boolean = false;
  cancellationModules: any = [];
  selectedcancellationModuleOID: any;
  selectedCancellationModule: any;
  @Input() modulesEventsSubject: Observable<void>;
  eventsSubscription: Subscription;
  selectedCancellationFormulaObj: any;

  constructor(
    private planService: PlanService,
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.product.modules.length > 0) {
      this.cancellationModules = this.product.modules
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
            this.selectedcancellationModuleOID = prodEle.moduleOID;
            this.selectedCancellationModule = prodEle;
          }
        });
      });
    }
    this.eventsSubscription = this.modulesEventsSubject.subscribe(() => {
      if (
        this.cancellationModules.length > 0 &&
        !this.selectedcancellationModuleOID
      ) {
        return;
      }
      if (this.selectedcancellationModuleOID) {
        this.selectedCancellationFormulaObj = {
          moduleOID: this.selectedcancellationModuleOID,
          cronJobSettings: this.selectedCancellationModule.cronJobSettings,
          isEnabled: true,
        };
        return;
      }
    });
  }

  showFormulas() {
    this.cancellationModules = this.cancellationModules.map((x) => {
      x['selected'] = false;
      if (this.selectedcancellationModuleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.cancellationModules;
    modalRef.componentInstance.selectedFormula =
      this.selectedCancellationModule;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.heading = this.translateService.instant(
      `plan.cancellation.configureFormula`
    );
    modalRef.closed.subscribe((data) => {
      this.selectedcancellationModuleOID = data?.moduleOID;
      this.selectedCancellationModule = data;
      this.cancellationModules = this.cancellationModules.map((x) => {
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
    modalRef.componentInstance.heading = `plan.cancellation.rulesTitle`;
    modalRef.componentInstance.subCategories = [
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
      },
      {
        name: 'IG_RULE_SUBCATEGORY_CALCULATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Modifier'],
      },
    ];
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
