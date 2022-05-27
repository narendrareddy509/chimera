import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanNoClaimDiscountRateComponent } from './plan-no-claim-discount-rate.component';

describe('PlanNoClaimDiscountRateComponent', () => {
  let component: PlanNoClaimDiscountRateComponent;
  let fixture: ComponentFixture<PlanNoClaimDiscountRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanNoClaimDiscountRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanNoClaimDiscountRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
