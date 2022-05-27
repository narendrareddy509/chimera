import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Plan } from '../../model/plan.model';
@Component({
  selector: 'ignatica-plan-parameters-navigation',
  templateUrl: './plan-parameters-navigation.component.html',
  styleUrls: ['./plan-parameters-navigation.component.scss'],
})
export class PlanParametersNavigationComponent implements OnInit {
  @Input() plan: Plan;
  @Input() heading: string = 'coi';
  @Input() surrenderView: boolean = false;
  @Input() deathBenefitView: boolean = false;
  @Input() renewalView: boolean = false;
  @Input() noClaimDiscountView: boolean = false;
  @Input() endowmentView: boolean = false;
  @Input() commissionView: boolean = false;
  @Input() drivertView: boolean = false;
  @Input() motorView: boolean = false;
  @Input() financialChangesView: boolean = false;
  @Input() cashValueView: boolean = false;
  @Input() cancellationView: boolean = false;
  @Input() benefitHeading: string = 'title';
  @Input() surrenderCancellationView: boolean = false;
  @Input() lapsationReinstatementView: boolean = false;

  @ViewChild('paramNav') paramNav: ElementRef;

  windowScrolled: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      this.document.documentElement.scrollTop >
      this.paramNav.nativeElement.getBoundingClientRect().bottom +
        this.paramNav.nativeElement.getBoundingClientRect().height
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      this.document.documentElement.scrollTop <
        this.paramNav.nativeElement.getBoundingClientRect().y
    ) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  ngOnInit(): void {}

  navigateComp(event) {
    document.getElementById(event).style['scrollMarginTop'] = '20px';
    document.getElementById(event).scrollIntoView({ behavior: 'smooth' });
  }
}
