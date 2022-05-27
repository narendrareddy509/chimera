/**
 * COI Widget which contains Ujrah Charge Rate, coi module selection, coi summary and coi upload rate .
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
import { NgForm } from '@angular/forms';
import {
  PremiumModifier,
  FeesChargesConfiguration,
  PlanRateTable,
  PlanRateTableRow,
} from '../../model/planIndex.model';
import { DomSanitizer } from '@angular/platform-browser';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@shared/custom/component/modal/modal.service';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductTemplate } from '../../../products/model/productTemplate.model';

@Component({
  selector: 'ignatica-plan-coi-takaful-ilas',
  templateUrl: './plan-coi-takaful-ilas.component.html',
  styleUrls: ['./plan-coi-takaful-ilas.component.scss'],
})
export class PlanCoiTakafulIlasComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  @Input() planModules: any;
  @Input() action: string;
  formValid = false;
  taxChargeOID: string;
  ujrahChargeOID: string;
  taxPercentage: number = 0;
  ujrahChargePercentage: number;
  tabaruChargePercentage: number;
  premiumModifiers: Array<PremiumModifier> = [];
  coiSelectedModuleOID: string;
  coiSelectedModule: any;
  coiSelectedModuleObject: any;
  coiModules: any = [];
  coiRateTableKeys = [];
  coiRateTableRows = [];
  tableGuid: string = null;
  saveClicked = false;
  @ViewChild(PlanFormulasListComponent)
  planFormulasListComponent: PlanFormulasListComponent;
  eventsSubscription: Subscription;
  @ViewChild('modifierForm') modifierForm: NgForm;
  constructor(
    public popupService: ModalService,
    protected _sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    if (this.product.modules.length > 0) {
      this.coiModules = this.product.modules
        .filter((x) => x.widgetCode == 'plan-coi' && x.isEnabled)
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
      if (this.product.screenCode == 'ugbtofih') {
        this.ujrahChargeOID = this.product.feesAndChargesOptions.filter(
          (x) =>
            x.feesChargesBasisId == 'IG_CALCULATION_BASIS_COI' &&
            x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
            x.feesChargesTypeId == 'IG_CHARGES_UJRAH'
        )[0]?.feesChargesOID;
      }
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
      (x) => x.tableName == 'premium-coi-ilas'
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
        this.coiRateTableRows = coiPremiumOptions.map((x) => {
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
      if (this.product.screenCode == 'ugbtofih') {
        let chargePrc =
          this.feesChargesConfiguration.feesAndChargesOptions.filter(
            (x) => x.feesChargesOID == this.ujrahChargeOID
          );
        this.ujrahChargePercentage =
          chargePrc.length > 0 ? chargePrc[0].feesChargesFixedAmount  * 100 : 0;
        this.tabaruChargePercentage = 100 - this.ujrahChargePercentage;
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.saveClicked = true;
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
        isActive: true,
        isDeleted: false,
        feesChargesFixedAmount : this.taxPercentage / 100,
        feesChargesRate: 0,
        feesChargesRateTable: [],
      };
      if (this.product.screenCode == 'ugbtofih') {
        let chargeIndex =
          this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
            (x) => x.feesChargesOID == this.ujrahChargeOID
          );
        this.feesChargesConfiguration.feesAndChargesOptions[
          chargeIndex == -1
            ? this.feesChargesConfiguration.feesAndChargesOptions.length
            : chargeIndex
        ] = {
          feesChargesOID: this.ujrahChargeOID,
          feesChargesFixedAmount: this.ujrahChargePercentage / 100,
          feesChargesRate: 0,
          isDeleted: false,
          isActive: true,
          feesChargesRateTable: [],
        };
      }

      if (this.coiSelectedModuleOID) {
        this.coiSelectedModuleObject = {
          moduleOID: this.coiSelectedModuleOID,
          cronJobSettings: this.coiSelectedModule.cronJobSettings,
          isEnabled: true,
        };
      }
      this.formValid = this.modifierForm.valid;
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
        tableName: 'premium-coi-ilas',
        tableRows: coiPremiumRateTableRows,
        sourceFileName: sourceFileName,
        isActive: true,
        isDeleted: false,
      };
      let index = this.feesChargesConfiguration.premiumOptions.findIndex(
        (x) => x.tableName == 'premium-coi-ilas'
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
  ujrahChargePercentageChange(value) {
    this.tabaruChargePercentage = 100 - value;
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
      'plan.coi.formulasTitle'
    );
    modalRef.componentInstance.subTitle = 'Premium Formula';
    modalRef.closed.subscribe((data) => {
      this.coiSelectedModuleOID = data?.moduleOID;
      this.coiSelectedModule = data;
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
