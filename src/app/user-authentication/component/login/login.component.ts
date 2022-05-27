import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@shared/custom/service/authentication.service';
import { UserAuthenticationService } from '../../services/user-authentication.service';

@Component({
  selector: 'ignatica-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userAuthService: UserAuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.userAuthService.setForgotPwdState(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('reset-token');
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.error = '';
    this.loading = true;
    // this.router.navigate([this.returnUrl]);
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log('Data: ' + data);
          if (JSON.stringify(data['status']) == '202') {
            this.authenticationService.setCookie(data['data']['userName']);
            this.router.navigate([this.returnUrl]);
            setTimeout(function () {
              location.reload();
            }, 100);
          } else {
            this.error = 'Invalid Username/Password';
            this.loading = false;
          }
        },
        (error) => {
          console.log('Error: ' + error);
          this.error = 'Invalid Username/Password';
          this.loading = false;
        }
      );
  }

  forgotPassword() {
    this.userAuthService.setForgotPwdState(true);
    this.router.navigate(['/forgot-password']);
  }
}
