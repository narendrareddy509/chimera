import {  Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
const url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(private http: HttpClient) { }
  addLog(message: any,logLevel:string = 'info'){
    return this.http.post<any>(`${url}/logger`, {"message": message,"level":logLevel}
    ).subscribe(response => {     
     });
  }
}
