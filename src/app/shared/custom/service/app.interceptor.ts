import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor() {}
  handleError(error: HttpErrorResponse) {
    console.log('Error Occured !!!!');
    return throwError(error);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clone = request.clone({
      headers: request.headers.set('Content-Type', 'application/json')
    });
    return next.handle(clone).pipe(catchError(this.handleError));
  }
}
