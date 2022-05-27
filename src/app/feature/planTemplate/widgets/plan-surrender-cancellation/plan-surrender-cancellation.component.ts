import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import {
  FeesChargesConfiguration,
  GeneralConfiguration,
  ServicingEndorsementConfiguration,
  InitialDepositOptions,
  Module,
  PlanModule,
} from '../../model/planIndex.model';
import { PlanService } from '../../services/plan.service';
import { PlanModulesListComponent } from '../shared/plan-modules-list/plan-modules-list.component';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

import { modules } from '../../../products/model/productTemplate.model';

@Component({
  selector: 'ignatica-plan-surrender-cancellation',
  templateUrl: './plan-surrender-cancellation.component.html',
  styleUrls: ['./plan-surrender-cancellation.component.scss'],
})
export class PlanSurrenderCancellationComponent implements OnInit {
  formValid = false;
  @Input() initialDepositOptions: InitialDepositOptions;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  coolingOffPeriodDaysVal: any;
  @Input() servicingEndorsementConfiguration: ServicingEndorsementConfiguration;
  @Input() ruleCategories: string;
  @Input() product: any;
  @Input() generalConfiguration: GeneralConfiguration;
  @Input() disableControl: boolean = false;
  @Output() saveChargesFromChildEmit = new EventEmitter<object>();
  //applied for charges
  @Input() feesAndChargesOptions: any[] = [];
  @Input() feesChargesOID: string;
  surrenderModules: any = [];
  selectedSurrenderModuleOID: any;
  selectedSurrenderModule: any;
  @Input() modulesEventsSubject: Observable<any>;
  eventsSubscription: Subscription;
  selectedSurrenderFormulaObj: any;
  @ViewChild('SCForm') SCForm: NgForm;
  saveClicked: boolean = false;

  @Input() modulesArray: Array<Module>;
  public selectedModules: Array<modules> = [];
  selectedModulesObj: Array<PlanModule>;

  constructor(
    private planService: PlanService,
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.planService.getCurrencyValue().subscribe((event) => {
      if (event) {
        this.initialDepositOptions.depositCurrencyOID = event;
      }
    });
    if (
      this.servicingEndorsementConfiguration &&
      this.servicingEndorsementConfiguration.cancellationOptions &&
      this.servicingEndorsementConfiguration.cancellationOptions
        .coolingOffPeriodDays
    ) {
      this.coolingOffPeriodDaysVal =
        this.servicingEndorsementConfiguration.cancellationOptions.coolingOffPeriodDays;
    }

    if (this.modulesArray && this.modulesArray.length) {
      this.modulesArray.map((module) => {
        module.formulas = this.product.modules
          .filter((x) => x.widgetCode == module.widgetCode && x.isEnabled)
          .map((x) => {
            x['selected'] = false;
            if (
              this.generalConfiguration.planModules
                .map((p) => p.moduleOID)
                .includes(x.moduleOID)
            ) {
              x.selected = true;
              this.selectedModules.push(x);
            }
            return x;
          });
        return module;
      });
    }
    this.eventsSubscription = this.modulesEventsSubject.subscribe((data) => {
      if (data == 'publish') {
        this.saveClicked = true;
      }
      this.formValid = this.SCForm.valid;

      // Adding coolingoffperiod days to plan
      this.servicingEndorsementConfiguration.cancellationOptions = null;
      if (this.coolingOffPeriodDaysVal) {
        this.servicingEndorsementConfiguration.cancellationOptions = {
          isCoolingOffAllowed: true,
          coolingOffPeriodDays: this.coolingOffPeriodDaysVal,
        };
      }
      if (
        this.surrenderModules.length > 0 &&
        !this.selectedSurrenderModuleOID
      ) {
        return;
      }
      if (this.selectedSurrenderModuleOID) {
        this.selectedSurrenderFormulaObj = {
          moduleOID: this.selectedSurrenderModuleOID,
          cronJobSettings: this.selectedSurrenderModule.cronJobSettings,
          isEnabled: true,
        };
      }

      this.selectedModulesObj = [];
      if (this.selectedModules && this.selectedModules.length > 0) {
        this.selectedModules.forEach((formula) => {
          this.selectedModulesObj.push({
            moduleOID: formula.moduleOID,
            cronJobSettings: formula.cronJobSettings,
            isEnabled: true,
          });
        });
      }
    });
  }

  saveChargesEmit(charges, chargeType) {
    this.saveChargesFromChildEmit.emit({ param1: charges, param2: chargeType });
  }

  getDataByType() {
    let charges = Array.prototype.concat.apply(
      [],
      this.feesAndChargesOptions
        .filter((x) => x.feesChargesOID == this.feesChargesOID)
        .map((x) => x.feesChargesRateTable)
    );
    return charges ? charges : [];
  }

  showFormulas() {
    const modalRef = this.modalService.open(PlanModulesListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.moduleList = this.modulesArray;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.closed.subscribe((data) => {
      this.selectedModules = [];
      if (data) {
        data.forEach((element) => {
          element.formulas.forEach((formula) => {
            if (formula.selected) {
              this.selectedModules.push(formula);
            }
          });
        });
      }
    });
  }
  showUnderwritingRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = this.ruleCategories;
    modalRef.componentInstance.heading = `plan.surrenderCancellation.rulesTitle`;
    modalRef.componentInstance.subCategories = [
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_SURRENDER',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_CALCULATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Modifier'],
        category: 'IG_RULE_CATEGORY_SURRENDER',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_CANCEL',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_CALCULATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Modifier'],
        category: 'IG_RULE_CATEGORY_CANCEL',
      },
    ];
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter((x) =>
        this.ruleCategories.includes(x.ruleCategory)
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => !this.ruleCategories.includes(x.ruleCategory)
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
