import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanChargeRateTableComponent } from './plan-charge-rate-table.component';

describe('PlanChargeRateTableComponent', () => {
  let component: PlanChargeRateTableComponent;
  let fixture: ComponentFixture<PlanChargeRateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanChargeRateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanChargeRateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
