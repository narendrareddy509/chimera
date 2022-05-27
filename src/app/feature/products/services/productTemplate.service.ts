import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductTemplate } from '../../products/model/productTemplate.model';

@Injectable({
  providedIn: 'root',
})
export class ProductTemplateService {
  public profileObs$: BehaviorSubject<String> = new BehaviorSubject<String>('');
  selectedProduct: any = new EventEmitter();
  url: string = `${environment.apiUrl}/productTemplate`;
  constructor(private http: HttpClient) {}

  setSelectedProduct(productTemplate): void {
    this.selectedProduct.emit(productTemplate);
  }

  retrivePlanTemplates(): Observable<ProductTemplate> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ProductTemplate>(
      `${environment.apiUrl}/internal/productTemplates`,
      {
        headers: headers,
      }
    );
  }

  retriveProductTemplateById(id: string): Observable<ProductTemplate> {
    return this.http.get<ProductTemplate>(
      `${
        environment.apiUrl
      }/internal/productTemplate?productTemplateGuid=${id.toString()}`
    );
  }
}
