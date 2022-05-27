import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthenticationService } from '../../services/user-authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'ignatica-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loading = false;
  resetDone = false;
  error = '';
  forgotPasswordModel: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private userAuthService: UserAuthenticationService
  ) {}

  ngOnInit() {
    this.userAuthService.setForgotPwdState(false);
  }

  onSubmit() {
    this.router.navigate(['/login']);
  }

  sendPasswordResetLink() {
    this.loading = true;
    this.error = '';
    this.userAuthService
      .sendPasswordResetLink(this.forgotPasswordModel)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log('response: ' + response);
          if (JSON.stringify(response['success']) == 'true') {
            localStorage.removeItem('userId');
            localStorage.removeItem('reset-token');
            this.loading = false;
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('reset-token', response.data.token);
            this.resetDone = true;
          } else {
            this.error = this.translateService.instant(
              'login.resetPassword.resetPwdError'
            );
            this.loading = false;
          }
        },
        (error) => {
          this.error = this.translateService.instant(
            'login.resetPassword.resetPwdError'
          );
          this.loading = false;
        }
      );
  }
}
