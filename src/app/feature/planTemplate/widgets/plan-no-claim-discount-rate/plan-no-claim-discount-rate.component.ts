/**
 * No claim Discount Rate Widget which contains  No Claim Discount Rate .
 *
 * <p>
 * Former known as No Claim Discount
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
  selector: 'ignatica-plan-no-claim-discount-rate',
  templateUrl: './plan-no-claim-discount-rate.component.html',
  styleUrls: ['./plan-no-claim-discount-rate.component.scss'],
})
export class PlanNoClaimDiscountRateComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() disableControl: boolean = false;
  @Input() action: string;
  formValid = false;
  noClaimDiscountEventsSubject: Subject<void> = new Subject<void>();
  noClaimDiscountRateTableKeys = [];
  noClaimDiscountRateTableRows = [];
  saveClicked = false;
  eventsSubscription: Subscription;
  tableGuid: string = null;
  constructor(private translateService: TranslateService) {}
  ngOnInit(): void {
    let noClaimTable = this.feesChargesConfiguration.premiumOptions.filter(
      (x) => x.tableName == 'No Claim Discount Rate'
    );
    if (
      this.feesChargesConfiguration.premiumOptions.length > 0 &&
      noClaimTable
    ) {
      let noClaimDiscountPremiumOptions = noClaimTable[0].tableRows;
      this.tableGuid = noClaimTable[0].tableGuid;
      if (noClaimDiscountPremiumOptions.length > 0) {
        let noClaimDiscountKeys: any = Object.keys(
          noClaimDiscountPremiumOptions[0]['rateTable']
        );
        this.noClaimDiscountRateTableKeys = [
          'rowGuid',
          'id',
          'sourceFileName',
          'Effective Start Date',
          'Effective End Date',
          'Rate',
          'isActive',
          'isDeleted',
        ].concat(noClaimDiscountKeys);
        this.noClaimDiscountRateTableRows = noClaimDiscountPremiumOptions.map(
          (x) => {
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
            noClaimDiscountKeys.forEach((key) => {
              rateTable[key] = x['rateTable'][key];
            });
            return rateTable;
          }
        );
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.noClaimDiscountEventsSubject.next();
      let rateTableKeys = this.noClaimDiscountRateTableKeys.filter(
        (x) =>
          x !== 'Rate' &&
          x !== 'isActive' &&
          x !== 'isDeleted' &&
          x !== 'rowGuid' &&
          x !== 'sourceFileName' &&
          x !== 'id' &&
          x.toLocaleLowerCase() !== 'effectivestartdate' &&
          x.toLocaleLowerCase() !== 'effectiveenddate' &&
          x.toLocaleLowerCase() !== 'effective start date' &&
          x.toLocaleLowerCase() !== 'effective end date'
      );
      let sourceFileName;
      //Structured in this form of API input
      let noClaimDiscountPremiumRateTableRows =
        this.noClaimDiscountRateTableRows
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
        tableName: 'No Claim Discount Rate',
        tableRows: noClaimDiscountPremiumRateTableRows,
        sourceFileName: sourceFileName,
        isActive: true,
        isDeleted: false,
      };
      let index = this.feesChargesConfiguration.premiumOptions.findIndex(
        (x) => x.tableName == 'No Claim Discount Rate'
      );
      this.feesChargesConfiguration.premiumOptions[
        index == -1
          ? this.feesChargesConfiguration.premiumOptions.length
          : index
      ] = planRateTable;
    });
  }
  noClaimDiscountRateChangesEmit(rateKeys, rateData) {
    this.noClaimDiscountRateTableKeys = rateKeys;
    this.noClaimDiscountRateTableRows = rateData;
  }
}
