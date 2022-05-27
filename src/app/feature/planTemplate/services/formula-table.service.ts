import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
const url = environment.apiUrl;
const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FormulaTableService {
  selectedEvent;
  public selectedSurrenderEvent: Observable<any>;
  surrenderSelectedEvent$: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  constructor(private http: HttpClient) {
    this.selectedSurrenderEvent = this.surrenderSelectedEvent$.asObservable();
  }

  setSelectSurrenderValue(data) {
    this.surrenderSelectedEvent$.next(data);
  }
  getSelectedSurrenderEvent(): Observable<string> {
    return this.surrenderSelectedEvent$.asObservable();
  }

  saveFormulaTable(planGuid, formulaTableData): Observable<any> {
    this.getSelectedSurrenderEvent().subscribe((event) => {
      this.selectedEvent = event;
    });
    let status = 'ACTIVE';
    if (this.selectedEvent === 'IG_CAL_SURRENDER_FORMULA_003' || '') {
      status = 'INACTIVE';
    }
    let formulas = formulaTableData.map((x) => {
      let payload = {};
      let chargePayload;
      if (x && x.charge) {
        chargePayload = {
          coverageYear: x.charge.coverageYear,
          surrenderChargeAmount: x.charge.surrenderChargeAmount,
        };
      } else {
        chargePayload = {
          coverageYear: x.coverageYear,
          surrenderChargeAmount: x.surrenderChargeAmount,
        };
      }
      payload['charge'] = chargePayload;
      payload['planGuid'] = planGuid;
      payload['isActive'] = true;
      payload['isDeleted'] = false;
      payload['status'] = status;
      payload['formulaGuid'] = uuid();
      payload['srcFile'] = x.srcFile;
      payload['code'] = 'IG_CAL_SURRENDER_FORMULA_001';
      return payload;
    });
    return this.http.post<any>(`${url}/formulas`, formulas);
  }
}
