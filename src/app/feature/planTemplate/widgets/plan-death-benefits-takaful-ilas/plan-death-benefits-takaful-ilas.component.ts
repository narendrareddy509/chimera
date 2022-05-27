/**
 * Death Benefit Module Configuration Widget contains death benefit module and death benefit rate
 *
 * <p>
 * Former known as Death Benefit Formula
 * <p>
 *
 * @author Ignatica - [Narendrareddy Chitta]
 *
 */
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { FeesChargesConfiguration } from '../../model/feesChargesConfiguration.model';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { GeneralConfiguration } from '../../model/generalConfiguration.model';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-plan-death-benefits-takaful-ilas',
  templateUrl: './plan-death-benefits-takaful-ilas.component.html',
  styleUrls: ['./plan-death-benefits-takaful-ilas.component.scss'],
})
export class PlanDeathBenefitsTakafulIlasComponent implements OnInit {
  @Input() product: ProductTemplate;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() disableControl: boolean = false;
  selectedModule: any = '';
  saveClicked = false;
  eventsSubscription: Subscription;
  @Input() modulesEventsSubject: Observable<void>;
  formValid = true;
  selectedObject: any;
  moduleList = [];
  selectedDeathModuleOID: any;
  selectedDeathModule: any;
  @Input() modules: any;
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() ruleCategories = ['IG_RULE_CATEGORY_DEATH_CLAIM'];

  constructor(
    public translateService: TranslateService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    if (this.product) {
      if (this.product.modules.length > 0) {
        this.moduleList = this.product.modules.filter(
          (x) => x.widgetCode == 'plan-death-benefits' && x.isEnabled
        );
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
            prodEle.widgetCode === 'plan-death-benefits' &&
            prodEle.isEnabled
          ) {
            this.selectedDeathModuleOID = prodEle.moduleOID;
            this.selectedDeathModule = prodEle;
          }
        });
      });
    }

    this.eventsSubscription = this.modulesEventsSubject.subscribe(() => {
      this.saveClicked = true;

      this.modules.deathBenefitRate = 1;
      this.selectedObject = null;
      if (this.selectedDeathModuleOID) {
        this.selectedObject = {
          moduleOID: this.selectedDeathModuleOID,
          cronJobSettings: this.selectedDeathModule.cronJobSettings,
          isEnabled: true,
        };
        return;
      }
    });
  }

  showFormulas() {
    this.moduleList = this.moduleList.map((x) => {
      x['selected'] = false;
      if (this.selectedDeathModuleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.moduleList;
    modalRef.componentInstance.deathBenefitPercentage = 100;
    //modalRef.componentInstance.showDeathBenefitPercent = true;
    modalRef.componentInstance.selectedFormula = this.selectedDeathModule;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.heading = this.translateService.instant(
      'plan.deathBenefitModule.deathBenefitModuleTitle'
    );
    modalRef.closed.subscribe((data) => {
      this.selectedDeathModuleOID = data?.moduleOID;
      this.selectedDeathModule = data;
      // this.modules.deathBenefitRate = data.deathBenefitPercentage / 100;
      //this.deathBenefitPercentage = data.deathBenefitPercentage;
      this.moduleList = this.moduleList.map((x) => {
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
    modalRef.componentInstance.heading = 'plan.deathBenefitModule.rulesTitle';
    modalRef.componentInstance.ruleCategory = this.ruleCategories;
    modalRef.componentInstance.subCategories = [
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_CLAIM',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_CALCULATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Modifier'],
        category: 'IG_RULE_CATEGORY_CLAIM',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_DEATH_CLAIM',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_CALCULATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Modifier'],
        category: 'IG_RULE_CATEGORY_DEATH_CLAIM',
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
