import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCoiRateSummaryComponent } from './plan-coi-rate-summary.component';

describe('PlanCoiRateSummaryComponent', () => {
  let component: PlanCoiRateSummaryComponent;
  let fixture: ComponentFixture<PlanCoiRateSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCoiRateSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCoiRateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
