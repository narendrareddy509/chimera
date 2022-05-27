import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { v4 as uuid } from 'uuid';
const url = environment.apiUrl;
const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root',
})
export class ChargeTableService {
  constructor(private http: HttpClient) {}

  saveCharge(chargeData: any): Observable<any> {   
    return this.http.post<any>(`${url}/chargeTable`, chargeData);
  }

  getAllChargesByPlanGuid(planGuid: string): Observable<any[]> {
    return this.http.get<any[]>(`${url}/chargeTable/${planGuid}`, {
      headers: headers,
    });
  }
  
}
