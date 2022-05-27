import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { UserAuthenticationService } from '../../services/user-authentication.service';

@Component({
  selector: 'ignatica-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordModel: any = {};
  loading = false;
  resetDone = true;
  error = '';

  constructor(
    private router: Router,
    private userAuthService: UserAuthenticationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {}

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.loading = true;
    this.userAuthService
      .updatePassword(this.changePasswordModel)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log('response: ' + response);
          if (JSON.stringify(response['success']) == 'true') {
            this.resetDone = false;
          } else {
            this.error = this.translateService.instant(
              'login.changePassword.jwtError'
            );
            this.loading = false;
          }
        },
        (error) => {
          console.log('Error: ' + error);
          this.error = this.translateService.instant(
            'login.changePassword.jwtError'
          );
          this.loading = false;
        }
      );
  }
}
