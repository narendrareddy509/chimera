import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers';
import { PagenotfoundComponent } from './shared/custom/component/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {
    path: 'page-not-found',
    component: PagenotfoundComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./feature/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'plan',
    loadChildren: () =>
      import('./feature/planTemplate/planTemplate.module').then(
        (m) => m.PlanTemplateModule
      ),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./feature/products/product.module').then((m) => m.ProductModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'funds',
    loadChildren: () =>
      import('./master-management/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'master-management',
    loadChildren: () =>
      import('./master-management/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    loadChildren: () =>
      import('./user-authentication/user-authentication.module').then(
        (m) => m.UserAuthModule
      ),
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '/page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
})
export class AppRoutingModule {}
