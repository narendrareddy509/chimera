import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordResetGuard } from '../helpers/password-reset.guard';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { LoginComponent } from './component/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'forgot-password',
    canActivate: [PasswordResetGuard],
    component: ForgotPasswordComponent,
    pathMatch: 'full',
  },
  {
    path: 'change-password/:userId/:token',
    component: ChangePasswordComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAuthRoutingModule {}
