import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMotorDriverRateComponent } from './plan-motor-driver-rate.component';

describe('PlanMotorDriverRateComponent', () => {
  let component: PlanMotorDriverRateComponent;
  let fixture: ComponentFixture<PlanMotorDriverRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanMotorDriverRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMotorDriverRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
