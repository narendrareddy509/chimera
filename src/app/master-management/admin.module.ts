import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BillingModesComponent } from './component/billing-modes/billing-modes.component';
import { CurrenciesComponent } from './component/currencies/currencies.component';
import { FormulasComponent } from './component/formulas/formulas.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UnderwritingComponent } from './component/underwriting/underwriting.component';
import { UploadQuestionnaireComponent } from './component/underwriting/upload-questionnaire/upload-questionnaire.component';
import { UwCategoriesComponent } from './component/underwriting/uw-categories/uw-categories.component';
import { UwQuestionnaireComponent } from './component/underwriting/uw-questionnaire/uw-questionnaire.component';
import { FundUploadComponent } from './component/funds/fund-upload/fund-upload.component';
import { FundPriceComponent } from './component/funds/fund-price/fund-price.component';
import { CreateFundPriceComponent } from '../master-management/component/funds/create-fund-price/create-fund-price.component';
import { CustomFormsModule } from 'ng2-validation';
import { FundAddComponent } from './component/funds/fund-add/fund-add.component';

@NgModule({
  declarations: [
    BillingModesComponent,
    CurrenciesComponent,
    FormulasComponent,
    UnderwritingComponent,
    UploadQuestionnaireComponent,
    UwCategoriesComponent,
    UwQuestionnaireComponent,
    FundUploadComponent,
    FundPriceComponent,
    CreateFundPriceComponent,
    FundAddComponent,
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    CustomFormsModule,
  ],
  exports: [],
})
export class AdminModule {}
