import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingModesComponent } from './component/billing-modes/billing-modes.component';
import { CurrenciesComponent } from './component/currencies/currencies.component';
import { FormulasComponent } from './component/formulas/formulas.component';
import { FundAddComponent } from './component/funds/fund-add/fund-add.component';
import { FundPriceComponent } from './component/funds/fund-price/fund-price.component';
import { FundUploadComponent } from './component/funds/fund-upload/fund-upload.component';
import { UnderwritingComponent } from './component/underwriting/underwriting.component';

const routes: Routes = [
  {
    path: 'master-management',
    children: [
      {
        path: 'billing-modes',
        component: BillingModesComponent,
        pathMatch: 'full',
      },
      {
        path: 'currencies',
        component: CurrenciesComponent,
        pathMatch: 'full',
      },
      {
        path: 'formulas',
        component: FormulasComponent,
        pathMatch: 'full',
      },
      {
        path: 'underwriting',
        component: UnderwritingComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'funds',
    children: [
      {
        path: '',
        component: FundUploadComponent,
        pathMatch: 'full',
      },
      {
        path: 'fundprice',
        component: FundPriceComponent,
        pathMatch: 'full',
      },
      {
        path: 'addfund',
        component: FundAddComponent,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
