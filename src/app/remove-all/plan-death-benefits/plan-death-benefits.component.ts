/**
 * Death Benefit Module Configuration Widget contains death benefit module and death benefit rate
 *
 * <p>
 * Former known as Death Benefit Formula
 * <p>
 *
 * @author [Anitha]
 *
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ProductTemplate } from '../../feature/products/model/productTemplate.model';
import { GeneralConfiguration } from '../../feature/planTemplate/model/generalConfiguration.model';

@Component({
  selector: 'ignatica-plan-death-benefits',
  templateUrl: './plan-death-benefits.component.html',
  styleUrls: ['./plan-death-benefits.component.scss'],
})
export class PlanDeathBenefitsComponent implements OnInit {
  deathBenefitPercentage: number = null;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  selectedModule: any = '';
  saveClicked = false;
  eventsSubscription: Subscription;
  @Input() modulesEventsSubject: Observable<void>;
  @ViewChild('deathBenefitForm') deathBenefitForm: NgForm;
  formValid = false;
  selectedModuleDescription: any;
  selectedObject: any;
  moduleList = [];
  selectedDeathModuleOID: any;
  selectedDeathModule: any;
  @Input() modules: any;
  @Input() generalConfiguration: GeneralConfiguration;

  constructor(public translateService: TranslateService) {}
  ngOnInit(): void {
    if (this.product) {
      if (this.product.modules.length > 0) {
        this.moduleList = this.product.modules.filter(
          (x) => x.widgetCode == 'plan-death-benefits' && x.isEnabled
        );
      }
      this.deathBenefitPercentage =
        this.modules && this.modules.deathBenefitRate
          ? this.modules.deathBenefitRate * 100
          : null;

      this.product.modules.findIndex((prodEle) => {
        if (prodEle.widgetCode == 'plan-death-benefits' && prodEle.isEnabled) {
          this.selectedModule = prodEle.moduleOID;
        }
      });
      if (this.selectedModule) this.onModuleSelection(this.selectedModule);
    }
    if (
      this.generalConfiguration &&
      this.generalConfiguration.planModules &&
      this.generalConfiguration.planModules.length > 0
    ) {
      this.getSelectedDeathModule();
    } else {
      this.selectedModuleDescription = '';
    }

    this.eventsSubscription = this.modulesEventsSubject.subscribe(() => {
      this.saveClicked = true;
      if (!this.deathBenefitPercentage) {
        this.formValid = false;
        return;
      }
      if (this.moduleList.length <= 0) {
        this.formValid = false;
        return;
      }
      if (this.moduleList.length > 0 && !this.selectedDeathModuleOID) {
        this.formValid = false;
        return;
      }
      this.modules.deathBenefitRate = this.deathBenefitPercentage / 100;
      if (this.selectedModule) {
        this.selectedObject = {
          moduleOID: this.selectedDeathModuleOID,
          cronJobSettings: this.selectedDeathModule.cronJobSettings,
          isEnabled: true,
        };
        this.formValid = this.deathBenefitForm.valid;
        return;
      }
    });
  }

  getSelectedDeathModule() {
    this.generalConfiguration.planModules.forEach(async (planEle) => {
      this.product.modules.findIndex((prodEle) => {
        if (prodEle.moduleOID === planEle.moduleOID) {
          this.selectedDeathModuleOID = prodEle.moduleOID;
          this.selectedDeathModule = prodEle;
        }
      });
    });
  }

  onModuleSelection(event) {
    let filterCode: any = this.moduleList.filter((x) => x.moduleOID === event);
    if (filterCode && filterCode.length > 0) {
      this.selectedModuleDescription = filterCode[0].uiHelpText;
    }
  }
}
