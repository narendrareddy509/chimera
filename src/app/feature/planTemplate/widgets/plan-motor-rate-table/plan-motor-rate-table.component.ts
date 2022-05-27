/**
 * Vehicle Rate Widget which contains  vehicle summary and vehicle upload rate .
 *
 * <p>
 * Former known as Premium Rate
 * <p>
 *
 * @author [RekhaG]
 *
 */
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import {
  FeesChargesConfiguration,
  PlanRateTable,
} from '../../model/planIndex.model';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';

@Component({
  selector: 'ignatica-plan-motor-rate-table',
  templateUrl: './plan-motor-rate-table.component.html',
  styleUrls: ['./plan-motor-rate-table.component.scss'],
})
export class PlanMotorRateTableComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() disableControl: boolean = false;
  @Input() action: string;
  formValid = false;
  coiEventsSubject: Subject<void> = new Subject<void>();
  motorRateTableKeys = [];
  motorRateTableRows = [];
  tableGuid: string = null;
  saveClicked = false;
  eventsSubscription: Subscription;
  constructor(private translateService: TranslateService) {}
  ngOnInit(): void {
    let motorRateTable = this.feesChargesConfiguration.premiumOptions.filter(
      (x) => x.tableName == 'vehicle-rate'
    );
    if (
      this.feesChargesConfiguration.premiumOptions.length > 0 &&
      motorRateTable
    ) {
      let coiPremiumOptions = motorRateTable[0].tableRows;
      this.tableGuid = motorRateTable[0].tableGuid;
      if (coiPremiumOptions.length > 0) {
        let coiKeys: any = Object.keys(coiPremiumOptions[0]['rateTable']);
        this.motorRateTableKeys = [
          'rowGuid',
          'id',
          'sourceFileName',
          'Effective Start Date',
          'Effective End Date',
          'Rate',
          'isActive',
          'isDeleted',
        ].concat(coiKeys);
        this.motorRateTableRows = coiPremiumOptions.map((x) => {
          let rateTable = {
            rowGuid: x['rowGuid'],
            sourceFileName: x['sourceFileName'],
            'Effective Start Date': x['effectiveStartDate']
              ? moment(x['effectiveStartDate']).format('YYYY-MM-DD')
              : x['effectiveStartDate'],
            'Effective End Date': x['effectiveEndDate']
              ? moment(x['effectiveEndDate']).format('YYYY-MM-DD')
              : x['effectiveEndDate'],
            Rate: x['rate'],
            id: x['rowGuid'],
            isActive: x['isActive'],
            isDeleted: x['isDeleted'],
          };
          coiKeys.forEach((key) => {
            rateTable[key] = x['rateTable'][key];
          });
          return rateTable;
        });
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.coiEventsSubject.next();
      let rateTableKeys = this.motorRateTableKeys.filter(
        (x) =>
          x !== 'Rate' &&
          x !== 'isActive' &&
          x !== 'isDeleted' &&
          x !== 'rowGuid' &&
          x !== 'id' &&
          x !== 'sourceFileName' &&
          x.toLocaleLowerCase() !== 'effectivestartdate' &&
          x.toLocaleLowerCase() !== 'effectiveenddate' &&
          x.toLocaleLowerCase() !== 'effective start date' &&
          x.toLocaleLowerCase() !== 'effective end date'
      );
      let sourceFileName;
      //Structured in this form of API input
      let coiPremiumRateTableRows = this.motorRateTableRows
        .filter((x) => !x.isDeleted)
        .map((x) => {
          sourceFileName = x['sourceFileName'];
          let premiumOption: any = {
            rowGuid:
              this.action == 'new' || this.action == 'clone'
                ? null
                : x['rowGuid'],
            effectiveStartDate: new Date(x['Effective Start Date'])
              .toISOString()
              .replace('Z', '+0000'),
            effectiveEndDate: x['Effective End Date']
              ? new Date(x['Effective End Date'])
                  .toISOString()
                  .replace('Z', '+0000')
              : undefined,
            rate: x['Rate'],
            amount: 0,
            isActive: x['isActive'],
            isDeleted: x['isDeleted'],
          };
          premiumOption['rateTable'] = {};
          rateTableKeys.forEach((key) => {
            premiumOption['rateTable'][key] = x[key];
          });
          return premiumOption;
        });
      let planRateTable: PlanRateTable = {
        tableGuid:
          this.action == 'new' || this.action == 'clone'
            ? null
            : this.tableGuid,
        tableName: 'vehicle-rate',
        tableRows: coiPremiumRateTableRows,
        sourceFileName: sourceFileName,
        isActive: true,
        isDeleted: false,
      };
      let index = this.feesChargesConfiguration.premiumOptions.findIndex(
        (x) => x.tableName == 'vehicle-rate'
      );
      this.feesChargesConfiguration.premiumOptions[
        index == -1
          ? this.feesChargesConfiguration.premiumOptions.length
          : index
      ] = planRateTable;
    });
  }
  motorRateChangesEmit(rateKeys, rateData) {
    this.motorRateTableKeys = rateKeys;
    this.motorRateTableRows = rateData;
  }
}
