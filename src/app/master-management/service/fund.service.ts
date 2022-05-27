import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { v4 as uuid } from 'uuid';
const url = environment.apiUrl;
const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
@Injectable({
  providedIn: 'root'
})
export class FundService {
 
  constructor(private http: HttpClient) {}
  saveFund(data:any,filename:string,assetType:string) :Observable<any>{
    let assetData = data.map((x: any)=>{
      let fund = {};
      fund["status"]= 'ACTIVE';
      fund["isDeleted"] = false;
      fund["isActive"] =true;
      fund["assetType"] = assetType;
      fund["assetSource"] =filename;
      fund["assetGuid"] = uuid();
      fund["asset"] = x;
      return fund;
    });    
   return this.http.post<any>(`${url}/assets`,assetData);
  }
  
  getAllFunds(): Observable<any[]> {  
    return this.http.post<any[]>(
        `${url}/fund/retrieveAll`,
        {
          headers: headers,
        }
      );
  }
  getAllFundPrices():Observable<any[]> {  
    return this.http.get<any[]>(
        `${url}/internal/dailyFundPrices`,
        {
          headers: headers,
        }
      );
  }
}
