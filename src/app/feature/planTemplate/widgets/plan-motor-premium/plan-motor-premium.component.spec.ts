import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMotorPremiumComponent } from './plan-motor-premium.component';

describe('PlanMotorPremiumComponent', () => {
  let component: PlanMotorPremiumComponent;
  let fixture: ComponentFixture<PlanMotorPremiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanMotorPremiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMotorPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
