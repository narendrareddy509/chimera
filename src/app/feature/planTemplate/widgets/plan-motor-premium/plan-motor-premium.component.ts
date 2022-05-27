/**
 * Motor Premium Widget which contains premium rate, module selection, MIB Rate
 *
 * <p>
 * Former known as Premium
 * <p>
 *
 * @author [RekhaG]
 *
 */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { FeesChargesConfiguration } from '../../model/planIndex.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@shared/custom/component/modal/modal.service';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';

@Component({
  selector: 'ignatica-plan-motor-premium',
  templateUrl: './plan-motor-premium.component.html',
  styleUrls: ['./plan-motor-premium.component.scss'],
})
export class PlanMotorPremiumComponent implements OnInit {
  @ViewChild(PlanFormulasListComponent)
  planFormulasListComponent: PlanFormulasListComponent;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  @Input() planModules: any;
  @Input() action: string;
  taxChargeOID: string;
  taxPercentage: number = 0;
  premiumSelectedModuleObject: any;
  premiumSelectedModuleOID: string;
  premiumSelectedModule: string;
  mibChargeOID: string;
  mibPercentage: number = 0;
  premiumModules: Array<any> = [];
  eventsSubscription: Subscription;
  formValid = false;
  saveClicked = false;
  @ViewChild('premiumForm') premiumForm: NgForm;
  constructor(
    private translateService: TranslateService,
    public popupService: ModalService,
    protected _sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.product.modules.length > 0) {
      this.premiumModules = this.product.modules.filter(
        (x) => x.widgetCode == 'plan-premium'
      );
    }
    if (this.planModules.length > 0) {
      let coiMouleOids = this.premiumModules.map((x) => x.moduleOID);
      this.premiumSelectedModuleObject = this.product.modules.filter(
        (x) => coiMouleOids.indexOf(x.moduleOID) > -1
      )[0];
      this.premiumSelectedModuleOID =
        this.premiumSelectedModuleObject?.moduleOID;
      this.premiumSelectedModule = this.premiumSelectedModuleObject;
    }
    if (this.product.feesAndChargesOptions) {
      this.taxChargeOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_FACE_AMOUNT' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_TAX'
      )[0].feesChargesOID;
      this.mibChargeOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_COI' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_FORWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_UJRAH'
      )[0].feesChargesOID;
    }
    if (this.feesChargesConfiguration.feesAndChargesOptions.length > 0) {
      let txPrc = this.feesChargesConfiguration.feesAndChargesOptions.filter(
        (x) => x.feesChargesOID == this.taxChargeOID
      );
      this.taxPercentage =
        txPrc.length > 0 ? txPrc[0].feesChargesFixedAmount  * 100 : 0;
      let mibPrc = this.feesChargesConfiguration.feesAndChargesOptions.filter(
        (x) => x.feesChargesOID == this.mibChargeOID
      );
      this.mibPercentage =
        mibPrc.length > 0 ? mibPrc[0].feesChargesFixedAmount  * 100 : 0;
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.formValid = this.premiumForm.valid;
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
        isDeleted: false,
        isActive: true,
        feesChargesRateTable: [],
      };
      let mibIndex =
        this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
          (x) => x.feesChargesOID == this.mibChargeOID
        );
      this.feesChargesConfiguration.feesAndChargesOptions[
        mibIndex == -1
          ? this.feesChargesConfiguration.feesAndChargesOptions.length
          : mibIndex
      ] = {
        feesChargesOID: this.mibChargeOID,
        feesChargesFixedAmount : this.mibPercentage / 100,
        isActive: true,
        isDeleted: false,
        feesChargesRate: 0,
        feesChargesRateTable: [],
      };
    });
  }
  showFormulas() {
    this.premiumModules = this.premiumModules.map((x) => {
      x['selected'] = false;
      if (this.premiumSelectedModuleObject?.moduleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.premiumModules;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.selectedFormula =
      this.premiumSelectedModuleObject;

    modalRef.componentInstance.heading = this.translateService.instant(
      'plan.premium.formulasTitle'
    );
    modalRef.componentInstance.subTitle = 'Premium Formula';
    modalRef.closed.subscribe((data) => {
      this.premiumSelectedModuleOID = data?.moduleOID;
      this.premiumSelectedModule = data;
      this.premiumModules = this.premiumModules.map((x) => {
        x['selected'] = false;
        if (data?.moduleOID == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      });
    });
  }
}
