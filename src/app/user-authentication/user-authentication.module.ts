import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { UserAuthRoutingModule } from './user-authentication.routing.module';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { PasswordMatchDirective } from './password-match.directive';
import { LoginComponent } from './component/login/login.component';

@NgModule({
  declarations: [ForgotPasswordComponent, LoginComponent, ChangePasswordComponent, PasswordMatchDirective],
  imports: [
    NgSelectModule,
    CommonModule,
    SharedModule,
    UserAuthRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule
  ],
  exports: [],
})
export class UserAuthModule {}
