import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PlanDetailComponent } from './widgets/plan-detail/plan-detail.component';
import { PlanBillingComponent } from './widgets/plan-billing/plan-billing.component';
import { PlanClaimDiscountRateComponent } from '../../remove-all/plan-claim-discount-rate/plan-claim-discount-rate.component';
import { PlanTemplateRoutingModule } from './planTemplate-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { PlanDeathBenefitsComponent } from '../../remove-all/plan-death-benefits/plan-death-benefits.component';
import { FundWithdrawalComponent } from './widgets/fund-withdrawal/fund-withdrawal.component';
import { PlanChargeRateTableComponent } from './widgets/shared/plan-charge-rate-table/plan-charge-rate-table.component';
import { FundDepositComponent } from './widgets/fund-deposit/fund-deposit.component';
import { IsDecimalDirective } from './decimal.directive';
import { PlanFormulaComponent } from './widgets/surrender-formula/surrender-formula.component';
import { PlanRenewalFormulaComponent } from './widgets/plan-renewal-formula/plan-renewal-formula.component';
import { PlanReinstatementFormulaComponent } from './widgets/plan-reinstatement-formula/plan-reinstatement-formula.component';
import { PlanParametersNavigationComponent } from './widgets/plan-parameters-navigation/plan-parameters-navigation.component';
import { PlanCoiRateComponent } from './widgets/shared/plan-coi-rate/plan-coi-rate.component';
import { PlanCoiRateSummaryComponent } from './widgets/shared/plan-coi-rate-summary/plan-coi-rate-summary.component';
import { PlanCoiPremiumModifierComponent } from './widgets/shared/plan-coi-premium-modifier/plan-coi-premium-modifier.component';
import { ImportCsvTableComponent } from './widgets/shared/import-csv-table/import-csv-table.component';
import { ZezcudihComponent } from './component/screencodes/zezcudih/zezcudih.component';
import { BuimttjyComponent } from './component/screencodes/buimttjy/buimttjy.component';
import { PlanInvestmtOptionsComponent } from './widgets/plan-investmt-options/plan-investmt-options.component';
import { PlanListComponent } from './component/plan-list/plan-list.component';
import { UgbtofihComponent } from './component/screencodes/ugbtofih/ugbtofih.component';
import { XsgwuwyoComponent } from './component/screencodes/xsgwuwyo/xsgwuwyo.component';
import { PublishStatusPipe } from './pipe/publish-status.pipe';
import { PlanMotorRateTableComponent } from './widgets/plan-motor-rate-table/plan-motor-rate-table.component';
import { PlanMotorDriverRateComponent } from './widgets/plan-motor-driver-rate/plan-motor-driver-rate.component';
import { PlanNoClaimDiscountRateComponent } from './widgets/plan-no-claim-discount-rate/plan-no-claim-discount-rate.component';
import { PlanFormulasListComponent } from './widgets/shared/plan-formulas-list/plan-formulas-list.component';
import { PlanMotorPremiumComponent } from './widgets/plan-motor-premium/plan-motor-premium.component';
import { PlanSurrenderComponent } from './widgets/plan-surrender/plan-surrender.component';
import { PlanGeneralFeesChargeComponent } from './widgets/plan-general-fees-charge/plan-general-fees-charge.component';
import { PlanCoiTakafulIlasComponent } from './widgets/plan-coi-takaful-ilas/plan-coi-takaful-ilas.component';
import { PlanDeathBenefitsTakafulIlasComponent } from './widgets/plan-death-benefits-takaful-ilas/plan-death-benefits-takaful-ilas.component';
import { MjdkyidfComponent } from './component/screencodes/mjdkyidf/mjdkyidf.component';
import { PlanFinancialChangesComponent } from './widgets/plan-financial-changes/plan-financial-changes.component';
import { PlanCoiTermLifeComponent } from './widgets/plan-coi-term-life/plan-coi-term-life.component';
import { PlanBenefitsComponent } from './widgets/plan-benefits/plan-benefits.component';
import { PlanDividendComponent } from './widgets/plan-dividend/plan-dividend.component';
import { RetjegemComponent } from './component/screencodes/retjegem/retjegem.component';
import { NnbombosComponent } from './component/screencodes/nnbombos/nnbombos.component';
import { TdpnysbrComponent } from './component/screencodes/tdpnysbr/tdpnysbr.component';
import { KfbtvvclComponent } from './component/screencodes/kfbtvvcl/kfbtvvcl.component';
import { GyjhdxenComponent } from './component/screencodes/gyjhdxen/gyjhdxen.component';
import { FhrajgrzComponent } from './component/screencodes/fhrajgrz/fhrajgrz.component';
import { JzzmrqphComponent } from './component/screencodes/jzzmrqph/jzzmrqph.component';
import { VzfnlwepComponent } from './component/screencodes/vzfnlwep/vzfnlwep.component';
import { HewjbadxComponent } from './component/screencodes/hewjbadx/hewjbadx.component';
import { ShmyjxqpComponent } from './component/screencodes/shmyjxqp/shmyjxqp.component';
import { BaiknmbdComponent } from './component/screencodes/baiknmbd/baiknmbd.component';
import { RsweahxfComponent } from './component/screencodes/rsweahxf/rsweahxf.component';
import { PlanMedicalBenefitsComponent } from './widgets/plan-medical-benefits/plan-medical-benefits.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PlanLapsationComponent } from './widgets/plan-lapsation/plan-lapsation.component';
import { PlanDisbursementComponent } from './widgets/plan-disbursement/plan-disbursement.component';
import { PlanCashValueComponent } from './widgets/plan-cash-value/plan-cash-value.component';
import { PlanBenefitConfigurationComponent } from './widgets/plan-benefit-configuration/plan-benefit-configuration.component';
import { PlanComissionsComponent } from '../../remove-all/plan-comissions/plan-comissions.component';
import { PlanSurrenderRateTableComponent } from './widgets/shared/plan-surrender-rate-table/plan-surrender-rate-table.component';
import { PlanCancellationComponent } from './widgets/plan-cancellation/plan-cancellation.component';
import { PlanSurrenderCancellationComponent } from './widgets/plan-surrender-cancellation/plan-surrender-cancellation.component';
import { PlanLapsationReinstatementComponent } from './widgets/plan-lapsation-reinstatement/plan-lapsation-reinstatement.component';
import { PlanModulesListComponent } from './widgets/shared/plan-modules-list/plan-modules-list.component';
import { PlanRulesComponent } from './widgets/plan-rules/plan-rules.component';
import { PlanRulesModalComponent } from './widgets/shared/plan-rules-modal/plan-rules-modal.component';

@NgModule({
  declarations: [
    PlanDetailComponent,
    FundWithdrawalComponent,
    FundDepositComponent,
    PlanBillingComponent,
    ImportCsvTableComponent,
    PlanClaimDiscountRateComponent,
    PlanChargeRateTableComponent,
    IsDecimalDirective,
    PlanMotorPremiumComponent,
    PlanFormulaComponent,
    PlanDeathBenefitsComponent,
    PlanRenewalFormulaComponent,
    PlanReinstatementFormulaComponent,
    PlanParametersNavigationComponent,
    ZezcudihComponent,
    BuimttjyComponent,
    PlanCoiRateSummaryComponent,
    PlanCoiPremiumModifierComponent,
    PlanCoiRateComponent,
    PlanInvestmtOptionsComponent,
    PlanListComponent,
    PublishStatusPipe,
    PlanMotorRateTableComponent,
    PlanMotorDriverRateComponent,
    PlanNoClaimDiscountRateComponent,
    PlanFormulasListComponent,
    UgbtofihComponent,
    PlanSurrenderComponent,
    PlanGeneralFeesChargeComponent,
    PlanCoiTakafulIlasComponent,
    PlanDeathBenefitsTakafulIlasComponent,
    MjdkyidfComponent,
    PlanCoiTermLifeComponent,
    PlanFinancialChangesComponent,
    XsgwuwyoComponent,
    PlanBenefitsComponent,
    PlanDividendComponent,
    RetjegemComponent,
    PlanMedicalBenefitsComponent,
    NnbombosComponent,
    TdpnysbrComponent,
    KfbtvvclComponent,
    GyjhdxenComponent,
    FhrajgrzComponent,
    JzzmrqphComponent,
    VzfnlwepComponent,
    HewjbadxComponent,
    ShmyjxqpComponent,
    BaiknmbdComponent,
    RsweahxfComponent,
    PlanLapsationComponent,
    PlanDisbursementComponent,
    PlanCashValueComponent,
    PlanBenefitConfigurationComponent,
    PlanComissionsComponent,
    TdpnysbrComponent,
    KfbtvvclComponent,
    GyjhdxenComponent,
    FhrajgrzComponent,
    JzzmrqphComponent,
    VzfnlwepComponent,
    HewjbadxComponent,
    ShmyjxqpComponent,
    BaiknmbdComponent,
    RsweahxfComponent,
    PlanLapsationComponent,
    PlanDisbursementComponent,
    PlanCashValueComponent,
    PlanSurrenderRateTableComponent,
    PlanCancellationComponent,
    PlanSurrenderCancellationComponent,
    PlanLapsationReinstatementComponent,
    PlanModulesListComponent,
    PlanRulesComponent,
    PlanRulesModalComponent,
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    SharedModule,
    PlanTemplateRoutingModule,
    NgbModule,
    FormsModule,
    CustomFormsModule,
    Ng2SearchPipeModule,
  ],
  exports: [],
})
export class PlanTemplateModule {}
