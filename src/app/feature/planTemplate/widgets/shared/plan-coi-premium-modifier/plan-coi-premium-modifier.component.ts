/**
 * COI Premium Widget which contains premium modifier, tax rate charges, coi module selection .
 *
 * <p>
 * Former known as Premium Modifier
 * <p>
 *
 * @author [RekhaG]
 *
 */
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  ViewChild,
  Output,
} from '@angular/core';
import { PremiumModifier } from '../../../model/planIndex.model';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ignatica-plan-coi-premium-modifier',
  templateUrl: './plan-coi-premium-modifier.component.html',
  styleUrls: ['./plan-coi-premium-modifier.component.scss'],
})
export class PlanCoiPremiumModifierComponent implements OnInit {
  @Input() premiumModifiers: Array<PremiumModifier>;
  @Input() disableControl: boolean = false;
  @Input() coiModules = [];
  @Input() coiSelectedModule: string;
  saveClicked = false;
  coiEventsSubscription: Subscription;
  @Input() coiEventsSubject: Observable<void>;
  @ViewChild('modifierForm') modifierForm: NgForm;
  @Input() taxPercentage: number;
  selectedModuleDescription: any;
  constructor() {}

  ngOnInit(): void {
    this.coiEventsSubscription = this.coiEventsSubject.subscribe(() => {
      this.saveClicked = true;
    });
  }
  deletePremiumModifier(index) {
    this.premiumModifiers.splice(index, 1);
  }
  addPremiumModifier() {
    this.premiumModifiers.push({
      modifierGuid: null,
      modifierName: '',
      modifierPercentage: '',
      modifierExcess: '',
    });
  }
  onCoiModuleSelection(event) {
    let filterCode: any = this.coiModules.filter((x) => x.moduleOID === event);
    this.coiSelectedModule = event;
    if (filterCode && filterCode.length > 0) {
      this.selectedModuleDescription = filterCode[0].uiHelpText;
    }
  }
}
