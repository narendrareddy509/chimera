import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { GeneralConfiguration } from '../../model/generalConfiguration.model';
import { FeesChargesConfiguration } from '../../model/planIndex.model';
import { ReinstatementOptions } from '../../model/reinstatement.model';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
@Component({
  selector: 'ignatica-plan-reinstatement-formula',
  templateUrl: './plan-reinstatement-formula.component.html',
  styleUrls: ['./plan-reinstatement-formula.component.scss'],
})
export class PlanReinstatementFormulaComponent implements OnInit {
  @Input() product: any;
  @Input() reinstatement: ReinstatementOptions;
  @Input() disableControl: boolean = false;
  reinstatementFormulaOptions: any = [];
  reinstatementFormulaSelectedOID: any;
  reinstatementFormulaSelected: any;
  @ViewChild('RIForm') RIForm: NgForm;
  @Input() modulesEventsSubject: Observable<void>;
  @Input() formulas: Array<any>;
  eventsSubscription: Subscription;
  saveClicked = false;
  formValid = true;
  selectedFormulaDescription: any;
  @Input() generalConfiguration: GeneralConfiguration;
  selectedReinstatementFormulaObj: any;
  reinstatementFeeVal: number;
  reinstatementFeeOID: string;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;

  constructor(
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.product) {
      if (this.product.modules.length > 0) {
        this.reinstatementFormulaOptions = this.product.modules
          .filter((x) => x.widgetCode == 'plan-reinstatement' && x.isEnabled)
          .map((x) => {
            x['selected'] = false;
            return x;
          });
      }
      if (this.product.feesAndChargesOptions) {
        this.reinstatementFeeOID = this.product.feesAndChargesOptions.filter(
          (x) => x.feesChargesTypeId == 'IG_FEES_REINSTATEMENT'
        )[0].feesChargesOID;
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
            prodEle.widgetCode === 'plan-reinstatement' &&
            prodEle.isEnabled
          ) {
            this.reinstatementFormulaSelectedOID = prodEle.moduleOID;
            this.reinstatementFormulaSelected = prodEle;
          }
        });
      });
    }

    if (this.feesChargesConfiguration.feesAndChargesOptions.length > 0) {
      let txPrc = this.feesChargesConfiguration.feesAndChargesOptions.filter(
        (x) => x.feesChargesOID == this.reinstatementFeeOID
      );
      this.reinstatementFeeVal =
        txPrc.length > 0 ? txPrc[0].feesChargesFixedAmount  : 0;
    }

    this.eventsSubscription = this.modulesEventsSubject.subscribe(() => {
      this.saveClicked = true;
      let taxIndex =
        this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
          (x) => x.feesChargesOID == this.reinstatementFeeOID
        );
      this.feesChargesConfiguration.feesAndChargesOptions[
        taxIndex == -1
          ? this.feesChargesConfiguration.feesAndChargesOptions.length
          : taxIndex
      ] = {
        feesChargesOID: this.reinstatementFeeOID,
        isActive: true,
        isDeleted: false,
        feesChargesFixedAmount : this.reinstatementFeeVal,
        feesChargesRate: 0,
        feesChargesRateTable: [],
      };

      if (this.reinstatementFormulaSelectedOID) {
        this.selectedReinstatementFormulaObj = {
          moduleOID: this.reinstatementFormulaSelectedOID,
          cronJobSettings: this.reinstatementFormulaSelected.cronJobSettings,
          isEnabled: true,
        };
        return;
      }
      this.formValid = this.RIForm.valid;
    });
  }
  showFormulas() {
    this.reinstatementFormulaOptions = this.reinstatementFormulaOptions.map(
      (x) => {
        x['selected'] = false;
        if (this.reinstatementFormulaSelectedOID == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      }
    );
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.reinstatementFormulaOptions;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.selectedFormula =
      this.reinstatementFormulaSelected;
    modalRef.componentInstance.heading = this.translateService.instant(
      'plan.reinstatement.reinstatementFormula'
    );
    modalRef.closed.subscribe((data) => {
      this.reinstatementFormulaSelectedOID = data?.moduleOID;
      this.reinstatementFormulaSelected = data;
      this.reinstatementFormulaOptions = this.reinstatementFormulaOptions.map(
        (x) => {
          x['selected'] = false;
          if (data?.moduleOID == x.moduleOID) {
            x['selected'] = true;
          }
          return x;
        }
      );
    });
  }
  showUnderwritingRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = 'IG_RULE_CATEGORY_REINSTATEMENT';
    modalRef.componentInstance.heading = 'plan.reinstatement.rulesTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_REINSTATEMENT'
      );
    modalRef.componentInstance.title = 'Death Benefit';
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_REINSTATEMENT'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
