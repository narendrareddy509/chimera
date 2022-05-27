import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { Plan } from '../../../model/plan.model';
import { PlanService } from '../../../services/plan.service';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';
import { ProductTemplate } from '../../../../products/model/productTemplate.model';
import {
  GeneralConfiguration,
  ServicingEndorsementConfiguration,
  FeesChargesConfiguration,
  InitialDepositOptions,
  BenefitConfiguration,
  ParticipatingPlan,
  CashWithdrawalOptions,
  InvestmentConfiguration,
  WithdrawalOptions,
} from '../../../model/planIndex.model';
import { Subject } from 'rxjs';
import { PlanDetailComponent } from '../../../widgets/plan-detail/plan-detail.component';
import { PlanBillingComponent } from '../../../widgets/plan-billing/plan-billing.component';
import { ChargeTableService } from '../../../services/charge-table.service';
import { PlanRulesComponent } from '../../../widgets/plan-rules/plan-rules.component';
import { Underwriting } from '../../../model/underwriting.model';
import { BillingOptions } from '../../../model/billingOptions.model';
import { PlanDeathBenefitsTakafulIlasComponent } from '../../../widgets/plan-death-benefits-takaful-ilas/plan-death-benefits-takaful-ilas.component';
import { PlanCoiTermLifeComponent } from '../../../widgets/plan-coi-term-life/plan-coi-term-life.component';
import { PlanSurrenderComponent } from '../../../widgets/plan-surrender/plan-surrender.component';

@Component({
  selector: 'ignatica-zezcudih',
  templateUrl: './zezcudih.component.html',
  styleUrls: ['./zezcudih.component.scss'],
})
export class ZezcudihComponent implements OnInit {
  @Output() plan: Plan = new Plan();
  questionnaireGuids: any[] = [];
  formulaTableData = [];
  eventsSubject: Subject<any> = new Subject<any>();
  modulesEventsSubject: Subject<any> = new Subject<any>();
  @ViewChild(PlanDetailComponent) detailChild: PlanDetailComponent;
  @ViewChild(PlanCoiTermLifeComponent)
  planCoiComponent: PlanCoiTermLifeComponent;
  @ViewChild(PlanBillingComponent) billingChild: PlanBillingComponent;
  @ViewChild(PlanRulesComponent)
  planUnderwritingChild: PlanRulesComponent;
  product: ProductTemplate;
  @ViewChild(PlanDeathBenefitsTakafulIlasComponent)
  planDeathBenefitsChild: PlanDeathBenefitsTakafulIlasComponent;
  @ViewChild(PlanSurrenderComponent)
  planSurrenderComponent: PlanSurrenderComponent;

  planId: any;
  action: string;
  loading = false;
  disableControl = false;
  publishLoading = false;
  statusColor = 'secondary';
  showGlobalParameters = true;
  PlanEntityData;
  feesChargesRegularOID: string;
  feesChargesSurrenderOID: string;
  feesChargesTopUpOID: string;
  feesChargesWithdrawalOID: string;
  ToastStatus: boolean;
  showErrorToastHeading: any;
  showErrorMessage: any;
  disableControls;

  constructor(
    private planService: PlanService,
    private router: Router,
    private chargeTableService: ChargeTableService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    public toastService: ToastService
  ) {
    this.route.params.subscribe(({ action, id }) => {
      this.planId = id;
      this.action = action;
      if (action == 'new') {
        this.plan = new Plan();
        this.plan.generalConfiguration = new GeneralConfiguration();
        this.plan.generalConfiguration.planModules = [];
        this.plan.generalConfiguration.participatingPlan =
          new ParticipatingPlan();
        this.plan.servicingEndorsementConfiguration =
          new ServicingEndorsementConfiguration();
        this.plan.servicingEndorsementConfiguration.billingOptions =
          new BillingOptions();
        this.plan.servicingEndorsementConfiguration.billingOptions.billingModes =
          [];
        this.plan.servicingEndorsementConfiguration.billingOptions.billingCurrencies =
          [];
        this.plan.servicingEndorsementConfiguration.billingOptions.billingMethods =
          [];
        this.plan.servicingEndorsementConfiguration.cashWithdrawalOptions =
          new CashWithdrawalOptions();

        this.plan.investmentConfiguration = new InvestmentConfiguration();
        this.plan.investmentConfiguration.initialDepositOptions =
          new InitialDepositOptions();
        this.plan.investmentConfiguration.withdrawalOptions =
          new WithdrawalOptions();
        this.plan.feesChargesConfiguration = new FeesChargesConfiguration();
        this.plan.feesChargesConfiguration.feesAndChargesOptions = [];
        this.plan.nbUnderwritingConfiguration = new Underwriting();
        this.plan.publishStatus = 'NOT_PUBLISHED';
        this.plan.benefitConfiguration = new BenefitConfiguration();
        this.plan.benefitConfiguration.deathBenefitOptions = {
          deathBenefitRate: 1,
        };
      }
      if (action == 'edit' || action == 'clone') {
        this.planService.getPlan(this.planId).subscribe((response: any) => {
          const plan = response.data;
          if (plan) {
            this.plan = plan;

            if (!this.plan.benefitConfiguration) {
              this.plan.benefitConfiguration = new BenefitConfiguration();
            }
            if (!this.plan.generalConfiguration.participatingPlan) {
              this.plan.generalConfiguration.participatingPlan =
                new ParticipatingPlan();
            }
            if (
              !this.plan.servicingEndorsementConfiguration.cashWithdrawalOptions
            ) {
              this.plan.servicingEndorsementConfiguration.cashWithdrawalOptions =
                new CashWithdrawalOptions();
            }

            if (!this.plan.feesChargesConfiguration) {
              this.plan.feesChargesConfiguration =
                new FeesChargesConfiguration();
              this.plan.feesChargesConfiguration.feesAndChargesOptions = [];
            }

            if (!this.plan.servicingEndorsementConfiguration) {
              this.plan.servicingEndorsementConfiguration =
                new ServicingEndorsementConfiguration();
              this.plan.servicingEndorsementConfiguration.billingOptions =
                new BillingOptions();
            }

            if (!this.plan.investmentConfiguration) {
              this.plan.investmentConfiguration = new InvestmentConfiguration();
            }
            if (!this.plan.investmentConfiguration.initialDepositOptions) {
              this.plan.investmentConfiguration.initialDepositOptions =
                new InitialDepositOptions();
            }
            if (!this.plan.investmentConfiguration.withdrawalOptions) {
              this.plan.investmentConfiguration.withdrawalOptions =
                new WithdrawalOptions();
            }
            if (action == 'clone') {
              this.plan.publishStatus = 'NOT_PUBLISHED';
              this.disableControl = false;
            }
            if (
              action == 'edit' &&
              this.plan.publishStatus !== 'NOT_PUBLISHED' &&
              this.plan.publishStatus !== 'PUBLISH_FAILED'
            ) {
              this.disableControl = true;
            }
          }
        });
      }
    });
    if (!this.planService.productSelected) {
      this.router.navigate(['/']);
    } else {
      this.product = this.planService.productSelected;
      this.feesChargesRegularOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_TRANSACTION_AMOUNT' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_FUND_DEPOSIT_REGULAR'
      )[0].feesChargesOID;
      this.feesChargesTopUpOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_TRANSACTION_AMOUNT' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_FUND_DEPOSIT_SUBSEQUENT'
      )[0].feesChargesOID;
      this.feesChargesWithdrawalOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_TRANSACTION_AMOUNT' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_BACKWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_FUND_WITHDRAWAL'
      )[0].feesChargesOID;
      this.feesChargesSurrenderOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_FACE_AMOUNT' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_SURRENDER'
      )[0].feesChargesOID;
    }
  }

  ngOnInit() {
    this.disableControls = this.action == 'new';
  }

  surrenderChargesEmit(data) {
    this.formulaTableData = data;
  }

  getPublishStatus(status) {
    switch (status) {
      case 'NOT_PUBLISHED':
        this.statusColor = 'secondary';
        return this.translateService.instant('plan.alertMessages.notPublished');
      case 'PUBLISH_STARTED':
        this.statusColor = 'primary';
        return this.translateService.instant(
          'plan.alertMessages.publishStarted'
        );
      case 'PUBLISH_IN_PROGRESS':
        this.statusColor = 'info';
        return this.translateService.instant(
          'plan.alertMessages.publishInProgress'
        );
      case 'PUBLISHED':
        this.statusColor = 'success';
        return this.translateService.instant('plan.alertMessages.published');
      default:
        return this.translateService.instant('plan.alertMessages.notPublished');
    }
  }
  changeTOISODate() {
    this.plan.generalConfiguration.effectiveEndDate = this.plan
      .generalConfiguration.effectiveEndDate
      ? new Date(this.plan.generalConfiguration.effectiveEndDate)
          .toISOString()
          .replace('Z', '+0000')
      : this.plan.generalConfiguration.effectiveEndDate;
    this.plan.generalConfiguration.effectiveStartDate = this.plan
      .generalConfiguration.effectiveStartDate
      ? new Date(this.plan.generalConfiguration.effectiveStartDate)
          .toISOString()
          .replace('Z', '+0000')
      : this.plan.generalConfiguration.effectiveStartDate;
  }
  savePlan(action: string) {
    this.emitEventToChild(action);
    this.emitModuleEventToChild(action);
    let detailCompValid = this.detailChild.formValid;
    let planCoiValid = this.planCoiComponent.formValid;
    let billingCompValid = this.billingChild.formValid;
    //let lapsation = this.planLapsationReinstatementComponent.formValid;
    let deathBenefitValid = this.planDeathBenefitsChild.formValid;
    let underwritingValid = this.planUnderwritingChild
      ? this.planUnderwritingChild.formValid
      : true;
    this.plan.generalConfiguration.planModules = [];
    //Adding the respective widgetCode Module Data
    if (
      this.planCoiComponent &&
      this.planCoiComponent.coiSelectedModuleObject
    ) {
      this.plan.generalConfiguration.planModules.push(
        this.planCoiComponent.coiSelectedModuleObject
      );
    }

    if (
      this.planDeathBenefitsChild &&
      this.planDeathBenefitsChild.selectedObject
    ) {
      this.plan.generalConfiguration.planModules.push(
        this.planDeathBenefitsChild.selectedObject
      );
    }

    if (
      this.planSurrenderComponent &&
      this.planSurrenderComponent.selectedSurrenderFormulaObj
    ) {
      this.plan.generalConfiguration.planModules.push(
        this.planSurrenderComponent.selectedSurrenderFormulaObj
      );
    }

    // copy all the modules from Plan Template which does not have widget code to Plan
    let defaultModules = this.product.modules
      .filter((x) => (!x.widgetCode || x.widgetCode === ' ') && x.isEnabled)
      .map((y) => {
        return {
          moduleOID: y.moduleOID,
          cronJobSettings: y.cronJobSettings,
          isEnabled: y.isEnabled,
        };
      });
    if (defaultModules && defaultModules.length > 0) {
      this.plan.generalConfiguration.planModules.push(...defaultModules);
    }
    // Removing below attributes while updating plan
    delete this.plan.publishStatus;
    delete this.plan.active;
    delete this.plan.deleted;
    if (
      action == 'publish' &&
      detailCompValid &&
      planCoiValid &&
      billingCompValid &&
      deathBenefitValid &&
      underwritingValid
      //lapsation &&
    ) {
      this.publishPlan(action);
    } else if (detailCompValid && action == 'save') {
      this.savePlanService(action);
    } else {
      this.validateForm();
    }
  }
  savePlanService(action: string) {
    this.emitEventToChild(action);
    this.plan.productTemplateId = this.product.productTemplateOID;
    if (this.plan.productTemplateGuid) {
      delete this.plan['productTemplateGuid'];
    }
    this.plan.category = this.product.category;
    this.loading = true;
    this.changeTOISODate();
    if (this.plan.planGuid && this.action == 'edit') {
      this.planService.updatePlan(this.plan).subscribe(
        (response) => {
          this.showPlanCreateMessagePlan();
        },
        (err) => {
          this.toastService.show({
            title: 'Error',
            description: err,
            classname: 'warning',
          });
          this.loading = false;
        }
      );
    } else {
      this.planService.createPlan(this.plan).subscribe(
        (response) => {
          this.plan.planGuid = response.data.planGuid;
          this.showPlanCreateMessagePlan();
        },
        (err) => {
          this.toastService.show({
            title: 'Error',
            description: err,
            classname: 'warning',
          });
          this.loading = false;
        }
      );
    }
  }
  cancel(): void {
    this.router.navigate([
      `/planTemplate/plans/${this.product.productTemplateGuid}`,
    ]);
  }
  publishPlan(action: string) {
    this.emitEventToChild(action);

    this.changeTOISODate();
    if (!this.planCoiComponent.coiSelectedModuleObject) {
      const message = this.translateService.instant(
        'plan.coi.coimoduleRequired'
      );
      this.toastService.show({
        title: 'Error',
        description: message,
        classname: 'warning',
      });
      this.publishLoading = false;
      return;
    }

    this.plan.category = this.product.category;
    let tableCoi = this.plan.feesChargesConfiguration.premiumOptions.filter(
      (x) => x.tableName == 'premium-coi-ilas'
    );
    if (
      this.plan.feesChargesConfiguration.premiumOptions.length > 0 &&
      tableCoi.length > 0
    ) {
      let coiPremiumOptions = tableCoi[0].tableRows;
      let rateTableRows = coiPremiumOptions.filter(
        (item) => !item.isDeleted && item.isActive
      );
      if (rateTableRows.length <= 0) {
        const message = this.translateService.instant(
          'plan.coi.rateTableRequired'
        );
        this.toastService.show({
          title: this.translateService.instant(
            'plan.alertMessages.errorHeading'
          ),
          description: message,
          classname: 'warning',
        });
        this.publishLoading = false;
        return;
      }
    }
    if (this.plan.planGuid && this.action == 'edit') {
      const data = {
        planGuid: this.plan.planGuid,
      };
      this.planService.updatePlan(this.plan).subscribe(
        (response) => {
          this.planService.publishPlan(data).subscribe(
            (publishResponse) => {
              const message = this.translateService.instant(
                'plan.alertMessages.planPublised'
              );
              this.toastService.show({
                title: 'Success',
                description: message,
                classname: 'success',
              });
              this.router.navigate([
                `/planTemplate/plans/${this.product.productTemplateGuid}`,
              ]);
              this.publishLoading = false;
            },
            (err) => {
              this.toastService.show({
                title: 'Error',
                description: err,
                classname: 'warning',
              });
              this.publishLoading = false;
            }
          );
        },
        (err) => {
          this.toastService.show({
            title: 'Error',
            description: err,
            classname: 'warning',
          });
          this.publishLoading = false;
        }
      );
    } else {
      this.plan.productTemplateId = this.product.productTemplateOID;
      if (this.plan.productTemplateGuid) {
        delete this.plan['productTemplateGuid'];
      }
      this.publishLoading = true;
      this.planService.createPlan(this.plan).subscribe(
        (response) => {
          this.plan.planGuid = response.data.planGuid;
          const data = {
            planGuid: response.data.planGuid,
          };

          this.planService.publishPlan(data).subscribe(
            (publishResponse) => {
              const message = this.translateService.instant(
                'plan.alertMessages.planPublised'
              );
              this.toastService.show({
                title: 'Success',
                description: message,
                classname: 'success',
              });
              this.router.navigate([
                `/planTemplate/plans/${this.product.productTemplateGuid}`,
              ]);
              this.publishLoading = false;
            },
            (err) => {
              this.toastService.show({
                title: 'Error',
                description: err,
                classname: 'warning',
              });
              this.publishLoading = false;
            }
          );
        },
        (err) => {
          this.toastService.show({
            title: 'Error',
            description: err,
            classname: 'warning',
          });
          this.publishLoading = false;
        }
      );
    }
  }
  validateForm(): boolean {
    this.ToastStatus = true;

    const errorHeading = this.translateService.instant(
      'plan.alertMessages.errorHeading'
    );
    const errorTitle = this.translateService.instant(
      'plan.alertMessages.errorMessage'
    );
    this.showErrorToastHeading = errorHeading;
    this.showErrorMessage = errorTitle;
    setTimeout(() => {
      this.ToastStatus = false;
    }, 4000);
    return;
  }
  emitEventToChild(action) {
    this.eventsSubject.next(action);
  }
  emitModuleEventToChild(action) {
    this.modulesEventsSubject.next(action);
  }
  showPlanCreateMessagePlan() {
    const message = this.translateService.instant(
      'plan.alertMessages.planCreated'
    );
    this.toastService.show({
      title: 'Success',
      description: message,
      classname: 'success',
    });
    this.router.navigate([
      `/planTemplate/plans/${this.product.productTemplateGuid}`,
    ]);
    this.loading = false;
  }

  saveChargesFromChildEmit(charges, chargeType) {
    let feesAndChargesOptions = {
      feesChargesOID: chargeType,
      feesChargesRate: 0,
      feesChargesFixedAmount: 0,
      isActive: true,
      isDeleted: false,
      feesChargesRateTable: charges.map((y) => {
        delete y['isDeleted'];
        return y;
      }),
    };
    this.plan.feesChargesConfiguration.feesAndChargesOptions =
      this.plan.feesChargesConfiguration.feesAndChargesOptions.filter(
        (x) => x.feesChargesOID !== chargeType
      );
    this.plan.feesChargesConfiguration.feesAndChargesOptions.push(
      feesAndChargesOptions
    );
  }
}
