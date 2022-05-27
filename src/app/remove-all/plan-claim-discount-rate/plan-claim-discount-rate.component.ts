import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { NoClaimDiscountRateChoices } from '../../feature/planTemplate/model/noClaimDiscount.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ignatica-plan-claim-discount-rate',
  templateUrl: './plan-claim-discount-rate.component.html',
  styleUrls: ['./plan-claim-discount-rate.component.scss'],
})
export class PlanClaimDiscountRateComponent implements OnInit {
  @Input() noClaimDiscountRateChoices: Array<NoClaimDiscountRateChoices>;
  @Input() disableControl: boolean = false;
  saveClicked = false;
  eventsSubscription: Subscription;
  @Input() eventsSubject: Observable<void>;
  @ViewChild('claimForm') claimForm: NgForm;
  formValid = false;
  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.saveClicked = true;
      this.formValid = this.claimForm.valid;
    });
  }
  addNoClaimDiscount() {
    this.noClaimDiscountRateChoices.push({
      noClaimDiscountPeriodYears: '',
      noClaimDiscountRate: '',
    });
  }
  deleteNoClaimDiscount(index) {
    this.noClaimDiscountRateChoices.splice(index, 1);
  }
}
