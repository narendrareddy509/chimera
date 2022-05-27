import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductTemplate } from '../model/productTemplate.model';
import { Product } from '../model/product.model';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url: string = `${environment.apiUrl}/productTemplate`;
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  retrieveProductTemplates(): Observable<ProductTemplate> {
    return this.http.get<ProductTemplate>(
      `${environment.apiUrl}/internal/productTemplates`,
      {
        headers: this.headers,
      }
    );
  }

  retrieveBundledProducts(): Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/internal/insuranceProducts`,
      {
        headers: this.headers,
      }
    );
  }

  createProduct(payload: Product): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/internal/insuranceProduct`,
      payload,
      {
        headers: this.headers,
      }
    );
  }

  retrieveBundledProductByGuid(insuranceProductGuid): Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/internal/insuranceProduct?insuranceProductGuid=${insuranceProductGuid}`,
      {
        headers: this.headers,
      }
    );
  }
  updateBundledProducts(payload: Product): Observable<Product> {
    return this.http.put<Product>(
      `${environment.apiUrl}/internal/insuranceProduct`,
      payload,
      {
        headers: this.headers,
      }
    );
  }
}
