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
import { NgForm } from '@angular/forms';
import { FeesChargesConfiguration } from '../../model/feesChargesConfiguration.model';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { GeneralConfiguration } from '../../model/generalConfiguration.model';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-plan-benefits',
  templateUrl: './plan-benefits.component.html',
  styleUrls: ['./plan-benefits.component.scss'],
})
export class PlanBenefitsComponent implements OnInit {
  benefitPercentage: number = 0;
  @Input() product: ProductTemplate;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() disableControl: boolean = false;
  @Input() category: string;
  @Input() widgetCode: string;
  @Input() benefitType: string;
  @Input() heading: string;
  @Input() percentageTitle: string;
  @Input() ratePercentage: any;
  @Input() generalConfiguration: GeneralConfiguration;
  exclusions: string;
  description: string;

  selectedModule: any = '';
  saveClicked = false;
  eventsSubscription: Subscription;
  @Input() eventsSubject: Observable<void>;
  @ViewChild('benefitForm') benefitForm: NgForm;
  formValid = false;
  selectedObject: any;
  moduleList = [];
  selectedBenefitModuleOID: any;
  selectedBenefitModule: any;

  constructor(
    public translateService: TranslateService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    if (this.product) {
      if (this.product.modules.length > 0) {
        this.moduleList = this.product.modules.filter(
          (x) => x.widgetCode == this.widgetCode && x.isEnabled
        );
      }
      this.benefitPercentage = this.ratePercentage
        ? this.ratePercentage * 100
        : 0;

      this.product.modules.findIndex((prodEle) => {
        if (prodEle.widgetCode == this.widgetCode && prodEle.isEnabled) {
          this.selectedBenefitModuleOID = prodEle.moduleOID;
        }
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
            this.selectedBenefitModuleOID = prodEle.moduleOID;
            this.selectedBenefitModule = prodEle;
          }
        });
      });
    }

    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.ratePercentage = this.benefitPercentage / 100;
      this.saveClicked = true;
      if (this.moduleList.length > 0 && !this.selectedBenefitModuleOID) {
        this.formValid = this.benefitForm.valid;
        return;
      }
      if (this.selectedBenefitModuleOID) {
        this.selectedObject = {
          moduleOID: this.selectedBenefitModuleOID,
          cronJobSettings: this.selectedBenefitModule.cronJobSettings,
          isEnabled: true,
        };
        this.formValid = this.benefitForm.valid;
        return;
      }
    });
  }

  showFormulas() {
    this.moduleList = this.moduleList.map((x) => {
      x['selected'] = false;
      if (this.selectedBenefitModuleOID == x.moduleOID) {
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
    modalRef.componentInstance.benefitPercentage = this.benefitPercentage;
    modalRef.componentInstance.selectedFormula = this.selectedBenefitModule;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.heading = this.translateService.instant(
      `plan.benefitModule.${this.benefitType}BenefitModuleTitle`
    );
    modalRef.closed.subscribe((data) => {
      this.selectedBenefitModuleOID = data.selectedFormula.moduleOID;
      this.selectedBenefitModule = data.selectedFormula;
      this.moduleList = this.moduleList.map((x) => {
        x['selected'] = false;
        if (data.selectedFormula == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      });
    });
  }
  showBenefitRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = this.category;
    modalRef.componentInstance.heading = `plan.benefitModule.${this.benefitType}RulesTitle`;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == this.category
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== this.category
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
