import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
const url = environment.apiUrl;
const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient, private papa: Papa) {}

  getAllEvents(isRequired?: any): Observable<any[]> {
    /* if (isRequired) {
      const httpOptions = {
        headers: new HttpHeaders({
          'is-required': isRequired
        })
      };
      console.log(isRequired);
      return this.http.get<any[]>(`${url}/master-management/events`, { headers: new HttpHeaders().set('is-required', isRequired) });
    }*/
    return this.http.get<any[]>(`${url}/master-management/events`);
  }

  updateEventStatus(data: Array<any>): Observable<any> {
    return this.http.put<any>(`${url}/master-management/events`, data);
  }
  getAllBillingModes(): Observable<any> {
    return this.http.post<any>(`${url}/billingMode/retrieveAll`, {
      headers: headers,
    });
  }
  updateBillingModeStatus(data: Array<any>): Observable<any> {
    return this.http.put<any>(`${url}/master-management/billingModes`, data);
  }
  getAllCurrencies(): Observable<any> {
    return this.http.post<any>(`${url}/currency/retrieveAll`, {
      headers: headers,
    });
  }
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${url}/master-management/categories`);
  }
  updateCurrenciesStatus(data: Array<any>): Observable<any> {
    return this.http.put<any>(`${url}/master-management/currencies`, data);
  }
  getAllFormulas(): Observable<any[]> {
    return this.http.get<any[]>(`${url}/master-management/formulas`);
  }
  getAllFormulaTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${url}/master-management/formulaTypes`);
  }
  updateFormulas(data: Array<any>): Observable<any> {
    return this.http.put<any>(`${url}/master-management/formulas`, data);
  }
  saveUnderwritingQuestionnaire(data: Array<any>): Observable<any> {
    return this.http.post<any>(`${url}/master-management/questionnaire`, data);
  }
  updateUnderwritingQuestionnaire(data: Array<any>): Observable<any> {
    return this.http.put<any>(`${url}/master-management/questionnaire`, data);
  }
  createUnderwritingCategories(data: Array<any>): Observable<any> {
    return this.http.post<any>(`${url}/master-management/underwriting`, data);
  }
  getUnderwritingCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${url}/master-management/underwriting`);
  }

  getUnderwritingQuestionnaire(
    currentPage: number,
    itemsPerPage: number,
    searchKey?: string
  ): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.set('page-number', currentPage.toString());
    headers = headers.set('per-page', itemsPerPage.toString());
    if (searchKey) {
      headers = headers.set('search-text', searchKey);
    }
    return this.http.get<any[]>(`${url}/master-management/questionnaire`, {
      headers: headers,
    });
  }

  downloadUnderwritingTemplate(fileName: string, templateData?: any): void {
    if (!templateData) {
      templateData = {
        data: [
          {
            Question: 'What is our client BMI values?',
            Type: 'Numeric',
            Answer: 'Null',
            'Condition 1': '18..30',
            'Action 1': 'Pass',
            'Condition 2': 'Null',
            'Action 2': 'Null',
          },
          {
            Question: 'Do the client have any Drug Abuse Experience?',
            Type: 'List',
            Answer: '[Y,N,Others]',
            'Condition 1': 'Y',
            'Action 1': 'Reject',
            'Condition 2': 'Others',
            'Action 2': 'Referral',
          },
        ],
      };
    }
    const csv = this.papa.unparse(templateData);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;

    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, fileName);
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }

    // For Browser
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
  }
}
