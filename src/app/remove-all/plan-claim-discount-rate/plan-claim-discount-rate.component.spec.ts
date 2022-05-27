import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanClaimDiscountRateComponent } from './plan-claim-discount-rate.component';

describe('PlanClaimDiscountRateComponent', () => {
  let component: PlanClaimDiscountRateComponent;
  let fixture: ComponentFixture<PlanClaimDiscountRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanClaimDiscountRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanClaimDiscountRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
