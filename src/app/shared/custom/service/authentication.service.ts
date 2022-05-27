import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authUrl = `${environment.apiUrl}/internal/login`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    let user: any;
    return this.http.post<any>(
      this.authUrl,
      JSON.stringify({ userId: username, password: password })
    );
  }

  logout() {
    // remove user from local storage to log user out
    this.deleteCookie(localStorage.getItem('currentUser'));
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setCookie(cname) {
    this.currentUserSubject.next(cname);
    localStorage.setItem('currentUser', cname);
    var date = new Date();
    date.setTime(date.getTime() + 3 * 60 * 60 * 1000);
    var expires = 'expires=' + date.toUTCString();
    document.cookie = cname + ';' + expires + ';path=/';
  }

  getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  deleteCookie(cname) {
    localStorage.removeItem(cname);
    document.cookie = cname + '=;expires=Thu 01 Jan 1970';
    this.currentUserSubject.next(null);
  }
}
