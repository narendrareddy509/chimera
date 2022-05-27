/**
 * COI Widget which contains premium modifier, tax rate charges, coi module selection, coi summary and coi upload rate .
 *
 * <p>
 * Former known as Premium Rate
 * <p>
 *
 * @author [Narendrareddy CH]
 
 */
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import {
  PremiumModifier,
  FeesChargesConfiguration,
  PlanRateTable,
  Underwriting,
} from '../../model/planIndex.model';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { PlanCoiPremiumModifierComponent } from '../shared/plan-coi-premium-modifier/plan-coi-premium-modifier.component';

@Component({
  selector: 'ignatica-plan-coi-term-life',
  templateUrl: './plan-coi-term-life.component.html',
  styleUrls: ['./plan-coi-term-life.component.scss'],
})
export class PlanCoiTermLifeComponent implements OnInit {
  @Input() heading: string = 'premium';
  widgetCode:string ='plan-premium';
  @ViewChild(PlanCoiPremiumModifierComponent)
  planCoiPremiumModifierComponent: PlanCoiPremiumModifierComponent;
  @Input() underwriting: Underwriting;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<any>;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  @Input() planModules: any;
  @Input() action: string;
  @Input() tableName:string;
  @ViewChild('modifierForm') modifierForm: NgForm;
  formValid = false;
  taxChargeOID: string;
  taxPercentage: number = 0;
  premiumModifiers: Array<PremiumModifier> = [];
  coiSelectedModuleOID: string;
  coiSelectedModule: any;
  coiSelectedModuleObject: any;
  coiEventsSubject: Subject<void> = new Subject<void>();
  coiRateTableKeys = [];
  coiRateTableRows = [];
  tableGuid: string = null;
  coiModules: any = [];
  saveClicked = false;
  eventsSubscription: Subscription;

  constructor(
    private translateService: TranslateService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.widgetCode = `plan-${this.heading}`;
    if (this.product.modules.length > 0) {
      this.coiModules = this.product.modules
        .filter((x) => x.widgetCode == this.widgetCode && x.isEnabled)
        .map((x) => {
          x['selected'] = false;
          return x;
        });
      let coiMouleOids = this.coiModules.map((x) => x.moduleOID);
      if (
        this.planModules.filter((x) => coiMouleOids.indexOf(x.moduleOID) > -1)
          .length > 0
      ) {
        this.coiSelectedModuleObject = this.product.modules.filter(
          (x) => coiMouleOids.indexOf(x.moduleOID) > -1
        )[0];
        this.coiSelectedModuleOID = this.coiSelectedModuleObject?.moduleOID;
        this.coiSelectedModule = this.coiSelectedModuleObject;
      }
    }
    if (this.product.feesAndChargesOptions) {
      this.taxChargeOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_FACE_AMOUNT' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_TAX'
      )[0]?.feesChargesOID;
    }
    if (this.planModules.length > 0) {
      let coiMouleOids = this.coiModules.map((x) => x.moduleOID);
      if (
        this.planModules.filter((x) => coiMouleOids.indexOf(x.moduleOID) > -1)
          .length > 0
      ) {
        this.coiSelectedModule = this.product.modules.filter(
          (x) => coiMouleOids.indexOf(x.moduleOID) > -1
        )[0];
        this.coiSelectedModuleOID = this.coiSelectedModule.moduleOID;
      }
    }
    let tableCoi = this.feesChargesConfiguration.premiumOptions.filter(
      (x) => x.tableName == this.tableName
    );

    if (
      this.feesChargesConfiguration.premiumOptions.length > 0 &&
      tableCoi.length > 0
    ) {
      let coiPremiumOptions = tableCoi[0].tableRows;
      this.tableGuid = tableCoi[0].tableGuid;
      if (coiPremiumOptions.length > 0) {
        let coiKeys: any = Object.keys(coiPremiumOptions[0]['rateTable']);
        this.coiRateTableKeys = [
          'rowGuid',
          'sourceFileName',
          'Effective Start Date',
          'Effective End Date',
          'Rate',
          'id',
          'isActive',
          'isDeleted',
        ].concat(coiKeys);
        this.coiRateTableRows = coiPremiumOptions
          .filter((x) => !x.isDeleted)
          .map((x) => {
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
    if (this.feesChargesConfiguration.premiumModifiers.length > 0) {
      this.premiumModifiers = this.feesChargesConfiguration.premiumModifiers;
    }
    if (this.feesChargesConfiguration.feesAndChargesOptions.length > 0) {
      let txPrc = this.feesChargesConfiguration.feesAndChargesOptions.filter(
        (x) => x.feesChargesOID == this.taxChargeOID
      );
      this.taxPercentage =
        txPrc.length > 0 ? txPrc[0].feesChargesFixedAmount  * 100 : 0;
    }
    this.eventsSubscription = this.eventsSubject.subscribe((data) => {
      if (data == 'publish') {
        this.saveClicked = true;
      }
      this.formValid = this.modifierForm.valid;
      this.feesChargesConfiguration.premiumModifiers = this.premiumModifiers;
      let taxIndex =
        this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
          (x) => x.feesChargesOID == this.taxChargeOID
        );
      this.feesChargesConfiguration.feesAndChargesOptions[
        taxIndex == -1
          ? this.feesChargesConfiguration.feesAndChargesOptions.length
          : taxIndex
      ] = {
        feesChargesOID: this.taxChargeOID,
        feesChargesFixedAmount : this.taxPercentage / 100,
        feesChargesRate: 0,
        feesChargesRateTable: [],
        isActive: true,
        isDeleted: false,
      };

      this.coiSelectedModuleObject = null;
      if (this.coiSelectedModuleOID) {
        this.coiSelectedModuleObject = {
          moduleOID: this.coiSelectedModuleOID,
          cronJobSettings: this.coiSelectedModule.cronJobSettings,
          isEnabled: true,
        };
      }
      let rateTableKeys = this.coiRateTableKeys.filter(
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
      let coiPremiumRateTableRows = this.coiRateTableRows
        //.filter((x) => !x.isDeleted)
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
        tableName: this.tableName,
        tableRows: coiPremiumRateTableRows,
        sourceFileName: sourceFileName,
        isActive: true,
        isDeleted: false,
      };
      let index = this.feesChargesConfiguration.premiumOptions.findIndex(
        (x) => x.tableName == this.tableName
      );
      this.feesChargesConfiguration.premiumOptions[
        index == -1
          ? this.feesChargesConfiguration.premiumOptions.length
          : index
      ] = planRateTable;
    });
  }
  coiRateChangesEmit(rateKeys, rateData) {
    this.coiRateTableKeys = rateKeys;
    this.coiRateTableRows = rateData;
  }
  showFormulas() {
    this.coiModules = this.coiModules.map((x) => {
      x['selected'] = false;
      if (this.coiSelectedModuleObject?.moduleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.coiModules;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.selectedFormula = this.coiSelectedModuleObject;

    modalRef.componentInstance.heading = this.translateService.instant(
      `plan.${this.heading}.formulasTitle`
    );
    modalRef.componentInstance.subTitle = 'Premium Formula';
    modalRef.closed.subscribe((data) => {
      this.coiSelectedModule = data;
      this.coiSelectedModuleOID = data?.moduleOID;
      this.coiModules = this.coiModules.map((x) => {
        x['selected'] = false;
        if (data?.moduleOID == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      });
    });
  }
}
