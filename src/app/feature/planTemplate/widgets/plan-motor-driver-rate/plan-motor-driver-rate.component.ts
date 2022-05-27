/**
 * Vehicle Driver Rate Widget which contains  Occupation Rate, Geographical Rate and Marital Status Rate .
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
  selector: 'ignatica-plan-motor-driver-rate',
  templateUrl: './plan-motor-driver-rate.component.html',
  styleUrls: ['./plan-motor-driver-rate.component.scss'],
})
export class PlanMotorDriverRateComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() disableControl: boolean = false;
  @Input() action: string;
  formValid = false;
  coiEventsSubject: Subject<void> = new Subject<void>();
  occupationRateTableKeys = [];
  occupationRateTableRows = [];
  occupationTableGuid: string = null;
  geographicalRateTableKeys = [];
  geographicalRateTableRows = [];
  geographicalTableGuid: string = null;
  maritalRateTableKeys = [];
  maritalRateTableRows = [];
  maritalTableGuid: string = null;
  saveClicked = false;
  eventsSubscription: Subscription;
  constructor(private translateService: TranslateService) {}
  ngOnInit(): void {
    if (this.feesChargesConfiguration.premiumOptions.length > 0) {
      //Occupation Loading Rate
      let occupationRateTable =
        this.feesChargesConfiguration.premiumOptions.filter(
          (x) => x.tableName == 'Occupation Loading Rate'
        );
      if (occupationRateTable) {
        let occupationPremiumOptions = occupationRateTable[0].tableRows;
        this.occupationTableGuid = occupationRateTable[0].tableGuid;
        if (occupationPremiumOptions.length > 0) {
          let coiKeys: any = Object.keys(
            occupationPremiumOptions[0]['rateTable']
          );
          this.occupationRateTableKeys = [
            'rowGuid',
            'id',
            'sourceFileName',
            'Effective Start Date',
            'Effective End Date',
            'Rate',
            'isActive',
            'isDeleted',
          ].concat(coiKeys);
          this.occupationRateTableRows = occupationPremiumOptions.map((x) => {
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
      //Geographical Loading Rate
      let geographicalRateTable =
        this.feesChargesConfiguration.premiumOptions.filter(
          (x) => x.tableName == 'Geographical Loading Rate'
        );
      if (geographicalRateTable) {
        let geographicalPremiumOptions = geographicalRateTable[0].tableRows;
        this.geographicalTableGuid = geographicalRateTable[0].tableGuid;
        if (geographicalPremiumOptions.length > 0) {
          let geographicalKeys: any = Object.keys(
            geographicalPremiumOptions[0]['rateTable']
          );
          this.geographicalRateTableKeys = [
            'rowGuid',
            'sourceFileName',
            'Effective Start Date',
            'Effective End Date',
            'Rate',
            'id',
            'isActive',
            'isDeleted',
          ].concat(geographicalKeys);
          this.geographicalRateTableRows = geographicalPremiumOptions.map(
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
              geographicalKeys.forEach((key) => {
                rateTable[key] = x['rateTable'][key];
              });
              return rateTable;
            }
          );
        }
      }

      //Marital Status Loading Rate
      let maritalRateTable =
        this.feesChargesConfiguration.premiumOptions.filter(
          (x) => x.tableName == 'Marital Status Loading Rate'
        );
      if (maritalRateTable) {
        let maritalPremiumOptions = maritalRateTable[0].tableRows;
        this.maritalTableGuid = maritalRateTable[0].tableGuid;
        if (maritalPremiumOptions.length > 0) {
          let maritalPremiumOptionsKeys: any = Object.keys(
            maritalPremiumOptions[0]['rateTable']
          );
          this.maritalRateTableKeys = [
            'rowGuid',
            'sourceFileName',
            'id',
            'Effective Start Date',
            'Effective End Date',
            'Rate',
            'isActive',
            'isDeleted',
          ].concat(maritalPremiumOptionsKeys);
          this.maritalRateTableRows = maritalPremiumOptions.map((x) => {
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
            maritalPremiumOptionsKeys.forEach((key) => {
              rateTable[key] = x['rateTable'][key];
            });
            return rateTable;
          });
        }
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.coiEventsSubject.next();
      this.saveOccupationLoadingRate();
      this.saveGeographicalLoadingRate();
      this.saveMaritalStatusLoadingRate();
    });
  }
  occupationRateChangesEmit(rateKeys, rateData) {
    this.occupationRateTableKeys = rateKeys;
    this.occupationRateTableRows = rateData;
  }
  maritalRateChangesEmit(rateKeys, rateData) {
    this.maritalRateTableKeys = rateKeys;
    this.maritalRateTableRows = rateData;
  }
  geographicalRateChangesEmit(rateKeys, rateData) {
    this.geographicalRateTableKeys = rateKeys;
    this.geographicalRateTableRows = rateData;
  }

  saveOccupationLoadingRate() {
    let rateTableKeys = this.occupationRateTableKeys.filter(
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
    //Occupation Loading Rate
    let coiPremiumRateTableRows = this.occupationRateTableRows
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
          : this.occupationTableGuid,
      tableName: 'Occupation Loading Rate',
      tableRows: coiPremiumRateTableRows,
      sourceFileName: sourceFileName,
      isActive: true,
      isDeleted: false,
    };
    let index = this.feesChargesConfiguration.premiumOptions.findIndex(
      (x) => x.tableName == 'Occupation Loading Rate'
    );
    this.feesChargesConfiguration.premiumOptions[
      index == -1 ? this.feesChargesConfiguration.premiumOptions.length : index
    ] = planRateTable;
  }
  saveGeographicalLoadingRate() {
    let rateTableKeys = this.geographicalRateTableKeys.filter(
      (x) =>
        x !== 'Rate' &&
        x !== 'isActive' &&
        x !== 'isDeleted' &&
        x !== 'id' &&
        x !== 'rowGuid' &&
        x !== 'sourceFileName' &&
        x.toLocaleLowerCase() !== 'effectivestartdate' &&
        x.toLocaleLowerCase() !== 'effectiveenddate' &&
        x.toLocaleLowerCase() !== 'effective start date' &&
        x.toLocaleLowerCase() !== 'effective end date'
    );
    let sourceFileName;
    //Structured in this form of API input
    //Geographical Loading Rate
    let coiPremiumRateTableRows = this.geographicalRateTableRows
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
          : this.geographicalTableGuid,
      tableName: 'Geographical Loading Rate',
      tableRows: coiPremiumRateTableRows,
      sourceFileName: sourceFileName,
      isActive: true,
      isDeleted: false,
    };
    let index = this.feesChargesConfiguration.premiumOptions.findIndex(
      (x) => x.tableName == 'Geographical Loading Rate'
    );
    this.feesChargesConfiguration.premiumOptions[
      index == -1 ? this.feesChargesConfiguration.premiumOptions.length : index
    ] = planRateTable;
  }
  saveMaritalStatusLoadingRate() {
    let rateTableKeys = this.maritalRateTableKeys.filter(
      (x) =>
        x !== 'Rate' &&
        x !== 'id' &&
        x !== 'isActive' &&
        x !== 'isDeleted' &&
        x !== 'rowGuid' &&
        x !== 'sourceFileName' &&
        x.toLocaleLowerCase() !== 'effectivestartdate' &&
        x.toLocaleLowerCase() !== 'effectiveenddate' &&
        x.toLocaleLowerCase() !== 'effective start date' &&
        x.toLocaleLowerCase() !== 'effective end date'
    );
    let sourceFileName;
    //Structured in this form of API input
    //Marital Status Loading Rate
    let coiPremiumRateTableRows = this.maritalRateTableRows
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
          : this.maritalTableGuid,
      tableName: 'Marital Status Loading Rate',
      tableRows: coiPremiumRateTableRows,
      sourceFileName: sourceFileName,
      isActive: true,
      isDeleted: false,
    };
    let index = this.feesChargesConfiguration.premiumOptions.findIndex(
      (x) => x.tableName == 'Marital Status Loading Rate'
    );
    this.feesChargesConfiguration.premiumOptions[
      index == -1 ? this.feesChargesConfiguration.premiumOptions.length : index
    ] = planRateTable;
  }
}
