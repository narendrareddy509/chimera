import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GeneralConfiguration } from '@app/feature/planTemplate/model/generalConfiguration.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { FeesChargesConfiguration } from '../../model/planIndex.model';
import { PlanService } from '../../services/plan.service';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';

@Component({
  selector: 'ignatica-plan-benefit-configuration',
  templateUrl: './plan-benefit-configuration.component.html',
  styleUrls: ['./plan-benefit-configuration.component.scss'],
})
export class PlanBenefitConfigurationComponent implements OnInit {
  @Input() benefitsOptions: any[] = [];
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() chargeType: string;
  @Input() ruleCategory: string;
  @Input() widgetCode: string;
  @Input() benefitType: string;
  @Input() heading: string;
  @Input() product: any;
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() disableControl: boolean = false;
  @Output() saveChargesFromChildEmit = new EventEmitter<object>();
  benefitModules: any = [];
  selectedbenefitModuleOID: any;
  selectedbenefitModule: any;
  @Input() modulesEventsSubject: Observable<void>;
  eventsSubscription: Subscription;
  selectedbenefitFormulaObj: any;

  constructor(
    private planService: PlanService,
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.product.modules.length > 0) {
      this.benefitModules = this.product.modules
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
            this.selectedbenefitModuleOID = prodEle.moduleOID;
            this.selectedbenefitModule = prodEle;
          }
        });
      });
    }
    this.eventsSubscription = this.modulesEventsSubject.subscribe(() => {
      this.benefitsOptions = this.benefitsOptions.map((x) => {
        delete x.isDeleted;
        return x;
      });
      if (this.benefitModules.length > 0 && !this.selectedbenefitModuleOID) {
        return;
      }
      if (this.selectedbenefitModuleOID) {
        this.selectedbenefitFormulaObj = {
          moduleOID: this.selectedbenefitModuleOID,
          cronJobSettings: this.selectedbenefitModule.cronJobSettings,
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
    return this.benefitsOptions;
  }

  showFormulas() {
    this.benefitModules = this.benefitModules.map((x) => {
      x['selected'] = false;
      if (this.selectedbenefitModuleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.benefitModules;
    modalRef.componentInstance.selectedFormula = this.selectedbenefitModule;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.heading = this.translateService.instant(
      `plan.${this.benefitType}.configureFormula`
    );
    modalRef.closed.subscribe((data) => {
      this.selectedbenefitModuleOID = data?.moduleOID;
      this.selectedbenefitModule = data;
      this.benefitModules = this.benefitModules.map((x) => {
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
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = this.ruleCategory;
    modalRef.componentInstance.heading = `plan.${this.benefitType}.rulesTitle`;
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
