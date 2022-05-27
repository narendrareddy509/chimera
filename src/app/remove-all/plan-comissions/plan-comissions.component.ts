/**
 * Commision Widget which contains commision formulas and commission upload rate .
 
 *
 * @author [RekhaG]
 *
 */
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {
  FeesChargesConfiguration,
  PlanRateTable,
} from '../../feature/planTemplate/model/planIndex.model';
import { DomSanitizer } from '@angular/platform-browser';
import { PlanFormulasListComponent } from '../../feature/planTemplate/widgets/shared/plan-formulas-list/plan-formulas-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@shared/custom/component/modal/modal.service';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductTemplate } from '../../feature/products/model/productTemplate.model';

@Component({
  selector: 'ignatica-plan-comissions',
  templateUrl: './plan-comissions.component.html',
  styleUrls: ['./plan-comissions.component.scss'],
})
export class PlanComissionsComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  @Input() planModules: any;
  @Input() action: string;
  commissionSelectedModuleOID: string;
  commissionSelectedModule: any;
  commissionSelectedModuleObject: any;
  commissionModules: any = [];
  commissionRateTableKeys = [];
  commissionRateTableRows = [];
  tableGuid: string = null;
  saveClicked = false;
  @ViewChild(PlanFormulasListComponent)
  planFormulasListComponent: PlanFormulasListComponent;
  eventsSubscription: Subscription;
  constructor(
    public popupService: ModalService,
    protected _sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    if (this.product.modules.length > 0) {
      this.commissionModules = this.product.modules
        .filter((x) => x.widgetCode == 'plan-commision' && x.isEnabled)
        .map((x) => {
          x['selected'] = false;
          return x;
        });
      let commissionMouleOids = this.commissionModules.map((x) => x.moduleOID);
      if (
        this.planModules.filter(
          (x) => commissionMouleOids.indexOf(x.moduleOID) > -1
        ).length > 0
      ) {
        this.commissionSelectedModuleObject = this.product.modules.filter(
          (x) => commissionMouleOids.indexOf(x.moduleOID) > -1
        )[0];
        this.commissionSelectedModule = this.commissionSelectedModuleObject;
        this.commissionSelectedModuleOID =
          this.commissionSelectedModuleObject?.moduleOID;
      }
    }

    if (this.planModules.length > 0) {
      let commissionMouleOids = this.commissionModules.map((x) => x.moduleOID);
      if (
        this.planModules.filter(
          (x) => commissionMouleOids.indexOf(x.moduleOID) > -1
        ).length > 0
      ) {
        this.commissionSelectedModule = this.product.modules.filter(
          (x) => commissionMouleOids.indexOf(x.moduleOID) > -1
        )[0];
        this.commissionSelectedModuleOID =
          this.commissionSelectedModule.moduleOID;
      }
    }
    let tablecommission = this.feesChargesConfiguration.commissionOptions;
    if (tablecommission.length > 0) {
      let commissionPremiumOptions = tablecommission[0].tableRows;
      this.tableGuid = tablecommission[0].tableGuid;
      if (commissionPremiumOptions.length > 0) {
        let commissionKeys: any = Object.keys(
          commissionPremiumOptions[0]['rateTable']
        );
        this.commissionRateTableKeys = [
          'rowGuid',
          'sourceFileName',
          'Effective Start Date',
          'Effective End Date',
          'Rate',
          'id',
          'isActive',
          'isDeleted',
        ].concat(commissionKeys);
        this.commissionRateTableRows = commissionPremiumOptions.map((x) => {
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
          commissionKeys.forEach((key) => {
            rateTable[key] = x['rateTable'][key];
          });
          return rateTable;
        });
      }
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.saveClicked = true;
      if (this.commissionSelectedModuleOID) {
        this.commissionSelectedModuleObject = {
          moduleOID: this.commissionSelectedModuleOID,
          cronJobSettings: this.commissionSelectedModule.cronJobSettings,
          isEnabled: true,
        };
      }
      let rateTableKeys = this.commissionRateTableKeys.filter(
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
      let commissionPremiumRateTableRows = this.commissionRateTableRows
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
        tableName: 'premium-commision',
        tableRows: commissionPremiumRateTableRows,
        sourceFileName: sourceFileName,
        isActive: true,
        isDeleted: false,
      };

      this.feesChargesConfiguration.commissionOptions[0] = planRateTable;
    });
  }
  commissionRateChangesEmit(rateKeys, rateData) {
    this.commissionRateTableKeys = rateKeys;
    this.commissionRateTableRows = rateData;
  }
  showFormulas() {
    this.commissionModules = this.commissionModules.map((x) => {
      x['selected'] = false;
      if (this.commissionSelectedModuleObject?.moduleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.commissionModules;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.selectedFormula =
      this.commissionSelectedModuleObject;

    modalRef.componentInstance.heading = this.translateService.instant(
      'plan.commission.formulasTitle'
    );
    modalRef.componentInstance.subTitle = 'Commission Formula';
    modalRef.closed.subscribe((data) => {
      this.commissionSelectedModule = data;
      this.commissionSelectedModuleOID = data?.moduleOID;
      this.commissionModules = this.commissionModules.map((x) => {
        x['selected'] = false;
        if (data?.moduleOID == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      });
    });
  }
}
