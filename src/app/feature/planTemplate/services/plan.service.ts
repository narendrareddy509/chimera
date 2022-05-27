import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Observable, of, pipe, timer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, share, switchMap, tap } from 'rxjs/operators';
import * as hash from 'object-hash';
import { Plan } from '../model/plan.model';
import { environment } from '../../../../environments/environment';
import { Papa } from 'ngx-papaparse';

const url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  [x: string]: any;
  plans$: BehaviorSubject<Plan[]> = new BehaviorSubject<Plan[]>([]);
  planlastAdded$: BehaviorSubject<Plan> = new BehaviorSubject<Plan>(null);
  store: { plans: Plan[]; selectedProduct: {} };
  productSelected: any;
  publishStatus$: BehaviorSubject<any> = new BehaviorSubject<Plan>(null);
  publishedStatus: Observable<any> = of({});
  planIdLastCreated: string;
  publishedStatuses: Observable<any> = of({});
  lastAddedPlanHash: string = '';
  public policyCurrencyEvent: Observable<any>;
  policyCurrencySelectedEvent$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  constructor(private http: HttpClient, private papa: Papa) {
    this.store = { plans: [], selectedProduct: {} };
    this.refreshPublishStatus();
    this.refreshStatuses();
    this.policyCurrencyEvent = this.policyCurrencySelectedEvent$.asObservable();
  }

  setCurrencyValue(data) {
    this.policyCurrencySelectedEvent$.next(data);
  }

  getCurrencyValue(): Observable<string> {
    return this.policyCurrencySelectedEvent$.asObservable();
  }

  refreshPublishStatus() {
    console.log('CALLING refreshPublishStatus WITH ', this.planIdLastCreated);
    this.publishedStatus = interval(5000).pipe(
      switchMap(() => {
        if (this.planIdLastCreated) {
          return this.http.get(`${url}/plans/${this.planIdLastCreated}`);
        }

        return of(null);
      }),
      retry(),
      share()
    );
  }

  refreshStatuses() {
    this.publishedStatuses = interval(5000).pipe(
      switchMap(() => {
        return this.getPublishStatuses();
      })
    );
  }

  getPublishStatuses(): Observable<any> {
    return this.http
      .get<Plan[]>(
        `${url}/plantemplates/${this.productSelected.planTemplateGuid}/plans`
      )
      .pipe(map((data: any) => data.data.plans));
  }

  getPublishStatus(): Observable<any> {
    return this.publishedStatus;
  }

  get plans() {
    return this.plans$.asObservable();
  }
  get isActive(): boolean {
    return this.productSelected.isActive;
  }

  // get planDefaults(): Object {
  //   return product.plan;
  // }

  create(plan: any): void {
    console.log('[PlanService.create] plan: ', JSON.stringify(plan));

    this.planIdLastCreated = plan.details.planGuid;
    plan.details.planTemplateGuid = this.productSelected.planTemplateGuid;
    const planToInsert: Plan = {
      ...plan,
    };

    console.log('Previous Hash: ', this.lastAddedPlanHash);
    const currentPlanHash = hash(planToInsert);
    console.log('Current Hash: ', currentPlanHash);
    if (currentPlanHash == this.lastAddedPlanHash) {
      console.log('Same as previously added plan');
      return;
    }

    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(`${url}/plans`, planToInsert).subscribe((response: any) => {
      this.lastAddedPlanHash = currentPlanHash;
      this.store.plans.push(response.data.plan);
      this.planlastAdded$.next(response.data.plan);
      this.plans$.next(
        {
          ...this.store,
        }.plans
      );
      // this.refreshPublishStatus();
    });
  }

  updatePlan(payload: Plan): Observable<Plan> {
    delete payload.publishStatus;
    delete payload.active;
    delete payload.deleted;
    if (payload.productTemplateGuid) {
      delete payload['productTemplateGuid'];
    }
    return this.http.post<any>(`${url}/plan/update`, payload);
  }
  createPlan(payload: Plan): Observable<any> {
    payload.integerPlanCode = 1;
    if (payload.productTemplateGuid) {
      delete payload['productTemplateGuid'];
    }
    return this.http.post(`${url}/plan/create`, payload);
  }

  delete() {}

  getPlan(planGuid: string) {
    try {
      if (!planGuid) {
        throw new Error('Invalid plan ID');
      }

      return this.http.post(`${url}/plan/retrieve`, {
        planGuid: planGuid,
        retrieveAttributes: [],
      });
    } catch (e) {
      console.log('[PlanService.get] Error: ', e);
    }
  }

  publish(plan: any) {
    console.log('[publish] plan: ', plan);
    this.create(plan);
    this.planlastAdded$.subscribe((plan: any) => {
      if (plan) {
        console.log('[publish.subscribe] plan: ', plan);
        const data = {
          planGuid: plan.planGuid,
          microserviceGuid: this.productSelected.microserviceGuid,
        };

        console.log('PLAN DATA: ', data);
        this.http
          .post(`${url}/plans/publish`, data)
          .subscribe((response: any) => {
            console.log(response);
            if (response.plan.publishStatus) {
              this.publishStatus$.next(response.plan.publishStatus);
            }
          });
      }
    });
  }
  publishPlan(data: any): Observable<any> {
    return this.http.post(`${url}/plan/publish`, data);
  }

  retriveAllPlansByTemplateGuid(
    productTemplateGuid: string
  ): Observable<Plan[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Plan[]>(
      `${url}/plan/productTemplateGuid/retrieveAll`,
      {
        productTemplateGuid: productTemplateGuid,
      },
      {
        headers: headers,
      }
    );
  }

  downloadSampleCSV(fileName: string, templateData: any): void {
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
