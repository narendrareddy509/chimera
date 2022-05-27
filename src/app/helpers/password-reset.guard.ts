import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { UserAuthenticationService } from '../user-authentication/services/user-authentication.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetGuard implements CanActivate {
  forgotPasswordState = false;
  constructor(
    private userAuthService: UserAuthenticationService,
    private router: Router
  ) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.userAuthService.getForgotPasswordstate().subscribe((event) => {
      this.forgotPasswordState = event;
    });
    if (this.forgotPasswordState) {
      return this.forgotPasswordState;
    }
    if(state.url === '/forgot-password' && !this.forgotPasswordState) {
      this.router.navigate(['/login']);
    }
    return this.forgotPasswordState;
  }
}
