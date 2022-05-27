import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMotorRateTableComponent } from './plan-motor-rate-table.component';

describe('PlanMotorRateTableComponent', () => {
  let component: PlanMotorRateTableComponent;
  let fixture: ComponentFixture<PlanMotorRateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanMotorRateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMotorRateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
