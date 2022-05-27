/**
 * COI Widget which contains premium modifier, tax rate charges, coi module selection, coi summary and coi upload rate .
 *
 * <p>
 * Former known as Premium Rate
 * <p>
 *
 * @author [RekhaG]
 *
 */
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
// import {
//   PremiumModifier,
//   FeesChargesConfiguration,
//   PlanRateTable,
//   PlanRateTableRow,
// } from '../../model/planIndex.model';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// import { ProductTemplate } from '../../../products/model/productTemplate.model';
// import { PlanCoiPremiumModifierComponent } from '../shared/plan-coi-premium-modifier/plan-coi-premium-modifier.component';

@Component({
  selector: 'ignatica-plan-coi',
  templateUrl: './plan-coi.component.html',
  styleUrls: ['./plan-coi.component.scss'],
})
export class PlanCoiComponent implements OnInit {
  // @ViewChild(PlanCoiPremiumModifierComponent)
  // planCoiPremiumModifierComponent: PlanCoiPremiumModifierComponent;
  // @Input() feesChargesConfiguration: FeesChargesConfiguration;
  // @Input() eventsSubject: Observable<void>;
  // @Input() product: ProductTemplate;
  // @Input() disableControl: boolean = false;
  // @Input() planModules: any;
  // @Input() action: string;
  // formValid = false;
  // taxChargeOID: string;
  // taxPercentage: number = 0;
  // premiumModifiers: Array<PremiumModifier> = [];
  // coiSelectedModule: string;
  // coiSelectedModuleObject: any;
  // coiEventsSubject: Subject<void> = new Subject<void>();
  // coiRateTableKeys = [];
  // coiRateTableRows = [];
  // tableGuid: string = null;
  // coiModules: any = [
  //   {
  //     uiDisplayElement: 'Modal COI based on face amount',
  //     moduleOID: '6130906c10ebee79682de105',
  //     uiHelpText:
  //       'Modal COI = (Face Amount x COI Rate x COI Modifier Rate + COI Modifier Excess) x (1 + Tax Rate) x Modal Factor',
  //   },
  //   {
  //     uiDisplayElement: 'Modal COI without face amount',
  //     moduleOID: '6130906c10ebee79682de104',
  //     uiHelpText:
  //       'Modal COI = (COI x COI Modifier Rate + COI Modifier Excess) x (1 + Tax Rate) x Modal Factor',
  //   },
  // ];
  // saveClicked = false;
  // eventsSubscription: Subscription;
  // constructor(private translateService: TranslateService) {}
  ngOnInit(): void {
    //   if (this.product.modules.length > 0) {
    //     this.coiModules = this.product.modules.filter(
    //       (x) => x.widgetCode == 'plan-coi' && x.isEnabled
    //     );
    //   }
    //   if (this.product.feesAndChargesOptions) {
    //     this.taxChargeOID = this.product.feesAndChargesOptions.filter(
    //       (x) =>
    //         x.feesChargesBasisId == 'IG_CALCULATION_BASIS_FACE_AMOUNT' &&
    //         x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
    //         x.feesChargesTypeId == 'IG_CHARGES_TAX'
    //     )[0].feesChargesOID;
    //   }
    //   if (this.planModules.length > 0) {
    //     let coiMouleOids = this.product.modules
    //       .filter((x) => x.widgetCode == 'plan-coi' && x.isEnabled)
    //       .map((x) => x.moduleOID);
    //     if (
    //       this.planModules.filter((x) => coiMouleOids.indexOf(x.moduleOID) > -1)
    //         .length > 0
    //     ) {
    //       this.coiSelectedModule = this.planModules.filter(
    //         (x) => coiMouleOids.indexOf(x.moduleOID) > -1
    //       )[0].moduleOID;
    //     }
    //   }
    //   let tableCoi = this.feesChargesConfiguration.premiumOptions.filter(
    //     (x) => x.tableName == 'premium-coi'
    //   );
    //   if (this.feesChargesConfiguration.premiumOptions.length > 0 && tableCoi) {
    //     let coiPremiumOptions = tableCoi[0].tableRows;
    //     this.tableGuid = tableCoi[0].tableGuid;
    //     if (coiPremiumOptions.length > 0) {
    //       let coiKeys: any = Object.keys(coiPremiumOptions[0]['rateTable']);
    //       this.coiRateTableKeys = [
    //         'rowGuid',
    //         'sourceFileName',
    //         'Effective Start Date',
    //         'Effective End Date',
    //         'Rate',
    //         'id',
    //         'isActive',
    //         'isDeleted',
    //       ].concat(coiKeys);
    //       this.coiRateTableRows = coiPremiumOptions.map((x) => {
    //         let rateTable = {
    //           rowGuid: x['rowGuid'],
    //           sourceFileName: x['sourceFileName'],
    //           'Effective Start Date': x['effectiveStartDate']
    //             ? moment(x['effectiveStartDate']).format('YYYY-MM-DD')
    //             : x['effectiveStartDate'],
    //           'Effective End Date': x['effectiveEndDate']
    //             ? moment(x['effectiveEndDate']).format('YYYY-MM-DD')
    //             : x['effectiveEndDate'],
    //           Rate: x['rate'],
    //           id: x['rowGuid'],
    //           isActive: x['isActive'],
    //           isDeleted: x['isDeleted'],
    //         };
    //         coiKeys.forEach((key) => {
    //           rateTable[key] = x['rateTable'][key];
    //         });
    //         return rateTable;
    //       });
    //     }
    //   }
    //   if (this.feesChargesConfiguration.premiumModifiers.length > 0) {
    //     this.premiumModifiers = this.feesChargesConfiguration.premiumModifiers;
    //   }
    //   if (this.feesChargesConfiguration.feesAndChargesOptions.length > 0) {
    //     let txPrc = this.feesChargesConfiguration.feesAndChargesOptions.filter(
    //       (x) => x.feesChargesOID == this.taxChargeOID
    //     );
    //     this.taxPercentage = txPrc.length > 0 ? txPrc[0].feesChargesFixedAmount  : 0;
    //   }
    //   this.eventsSubscription = this.eventsSubject.subscribe(() => {
    //     this.coiEventsSubject.next();
    //     this.feesChargesConfiguration.premiumModifiers = this.premiumModifiers;
    //     let taxIndex =
    //       this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
    //         (x) => x.feesChargesOID == this.taxChargeOID
    //       );
    //     this.feesChargesConfiguration.feesAndChargesOptions[
    //       taxIndex == -1
    //         ? this.feesChargesConfiguration.feesAndChargesOptions.length
    //         : taxIndex
    //     ] = {
    //       feesChargesOID: this.taxChargeOID,
    //       feesChargesFixedAmount: this.planCoiPremiumModifierComponent.taxPercentage,
    //       feesChargesRate: 0,
    //       isActive: true,
    //       isDeleted: false,
    //       feesChargesRateTable: [],
    //     };
    //     if (this.planCoiPremiumModifierComponent.coiSelectedModule) {
    //       this.coiSelectedModuleObject = {
    //         moduleOID: this.planCoiPremiumModifierComponent.coiSelectedModule,
    //         cronJobSettings: null,
    //         isEnabled: true,
    //       };
    //     }
    //     this.formValid = this.planCoiPremiumModifierComponent.modifierForm.valid;
    //     let rateTableKeys = this.coiRateTableKeys.filter(
    //       (x) =>
    //         x !== 'Rate' &&
    //         x !== 'isActive' &&
    //         x !== 'isDeleted' &&
    //         x !== 'rowGuid' &&
    //         x !== 'sourceFileName' &&
    //         x.toLocaleLowerCase() !== 'effectivestartdate' &&
    //         x.toLocaleLowerCase() !== 'effectiveenddate' &&
    //         x.toLocaleLowerCase() !== 'effective start date' &&
    //         x.toLocaleLowerCase() !== 'effective end date'
    //     );
    //     let sourceFileName;
    //     //Structured in this form of API input
    //     let coiPremiumRateTableRows = this.coiRateTableRows
    //       .filter((x) => !x.isDeleted)
    //       .map((x) => {
    //         sourceFileName = x['sourceFileName'];
    //         let premiumOption: any = {
    //           rowGuid:
    //             this.action == 'new' || this.action == 'clone'
    //               ? null
    //               : x['rowGuid'],
    //           effectiveStartDate: new Date(x['Effective Start Date'])
    //             .toISOString()
    //             .replace('Z', '+0000'),
    //           effectiveEndDate: x['Effective End Date']
    //             ? new Date(x['Effective End Date'])
    //                 .toISOString()
    //                 .replace('Z', '+0000')
    //             : undefined,
    //           rate: x['Rate'],
    //           amount: 0,
    //           isActive: x['isActive'],
    //           isDeleted: x['isDeleted'],
    //         };
    //         premiumOption['rateTable'] = {};
    //         rateTableKeys.forEach((key) => {
    //           premiumOption['rateTable'][key] = x[key];
    //         });
    //         return premiumOption;
    //       });
    //     let planRateTable: PlanRateTable = {
    //       tableGuid:
    //         this.action == 'new' || this.action == 'clone'
    //           ? null
    //           : this.tableGuid,
    //       tableName: 'premium-coi',
    //       tableRows: coiPremiumRateTableRows,
    //       sourceFileName: sourceFileName,
    //       isActive: true,
    //       isDeleted: false,
    //     };
    //     let index = this.feesChargesConfiguration.premiumOptions.findIndex(
    //       (x) => x.tableName == 'premium-coi'
    //     );
    //     this.feesChargesConfiguration.premiumOptions[
    //       index == -1
    //         ? this.feesChargesConfiguration.premiumOptions.length
    //         : index
    //     ] = planRateTable;
    //   });
  }
  // coiRateChangesEmit(rateKeys, rateData) {
  //   this.coiRateTableKeys = rateKeys;
  //   this.coiRateTableRows = rateData;
  // }
}
