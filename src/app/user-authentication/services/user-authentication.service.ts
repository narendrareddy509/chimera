import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
const url = environment.apiUrl;
const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root',
})
export class UserAuthenticationService {
  public forgotPwdState: Observable<Boolean>;
  forgotPwdState$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  userTokenInformation: any;
  constructor(private http: HttpClient) {
    this.forgotPwdState = this.forgotPwdState$.asObservable();
  }

  setForgotPwdState(data) {
    this.forgotPwdState$.next(data);
  }
  getForgotPasswordstate(): Observable<any> {
    return this.forgotPwdState$.asObservable();
  }

  sendPasswordResetLink(payload: any): Observable<any> {
    return this.http.post<any>(`${url}/users/forgot-password`, payload);
  }

  updatePassword(changePasswordData: any): Observable<any> {
    this.getForgotPasswordstate().subscribe((event) => {
      this.userTokenInformation = event;
    });
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('reset-token');
    return this.http.post<any>(
      `${url}/users/reset-password/${userId}/${token}`,
      changePasswordData
    );
  }
}
