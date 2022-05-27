/**
 * Disbursement Widget which contains Disbursement module selection, Disbursement rules
 *
 * @author [Narendrareddy CH]
 */
import { Component, Input, OnInit } from '@angular/core';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { GeneralConfiguration } from '../../model/generalConfiguration.model';
import { PlanFormulasListComponent } from '../shared/plan-formulas-list/plan-formulas-list.component';

@Component({
  selector: 'ignatica-plan-disbursement',
  templateUrl: './plan-disbursement.component.html',
  styleUrls: ['./plan-disbursement.component.scss'],
})
export class PlanDisbursementComponent implements OnInit {
  @Input() product: ProductTemplate;
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() disableControl: boolean = false;
  @Input() modulesEventsSubject: Observable<void>;
  eventsSubscription: Subscription;
  moduleList = [];
  selectedObject: any;
  selectedDisbursementModuleOID: any;
  selectedDisbursementModule: any;

  constructor(
    public translateService: TranslateService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.product) {
      if (this.product.modules.length > 0) {
        this.moduleList = this.product.modules.filter(
          (x) => x.widgetCode == 'plan-disbursement' && x.isEnabled
        );
      }
    }

    if (
      this.generalConfiguration &&
      this.generalConfiguration.planModules &&
      this.generalConfiguration.planModules.length > 0
    ) {
      this.generalConfiguration.planModules.forEach(async (planEle) => {
        this.product.modules.findIndex((prodEle) => {
          if (
            prodEle.moduleOID === planEle.moduleOID &&
            prodEle.widgetCode === 'plan-disbursement' &&
            prodEle.isEnabled
          ) {
            this.selectedDisbursementModuleOID = prodEle.moduleOID;
            this.selectedDisbursementModule = prodEle;
          }
        });
      });
    }

    this.eventsSubscription = this.modulesEventsSubject.subscribe(() => {
      if (this.moduleList.length > 0 && !this.selectedDisbursementModuleOID) {
        return;
      }
      if (this.selectedDisbursementModuleOID) {
        this.selectedObject = {
          moduleOID: this.selectedDisbursementModuleOID,
          cronJobSettings: this.selectedDisbursementModule.cronJobSettings,
          isEnabled: true,
        };
        return;
      }
    });
  }

  showFormulas() {
    this.moduleList = this.moduleList.map((x) => {
      x['selected'] = false;
      if (this.selectedDisbursementModuleOID == x.moduleOID) {
        x['selected'] = true;
      }
      return x;
    });
    const modalRef = this.modalService.open(PlanFormulasListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.formulas = this.moduleList;
    modalRef.componentInstance.selectedFormula =
      this.selectedDisbursementModule;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.heading = this.translateService.instant(
      'plan.deathBenefitModule.deathBenefitModuleTitle'
    );
    modalRef.closed.subscribe((data) => {
      this.selectedDisbursementModuleOID = data.selectedFormula.moduleOID;
      this.selectedDisbursementModule = data.selectedFormula;
      this.moduleList = this.moduleList.map((x) => {
        x['selected'] = false;
        if (data.selectedFormula == x.moduleOID) {
          x['selected'] = true;
        }
        return x;
      });
    });
  }
}
