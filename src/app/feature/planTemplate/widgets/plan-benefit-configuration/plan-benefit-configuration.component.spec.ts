import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanBenefitConfigurationComponent } from './plan-benefit-configuration.component';

describe('PlanBenefitConfigurationComponent', () => {
  let component: PlanBenefitConfigurationComponent;
  let fixture: ComponentFixture<PlanBenefitConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanBenefitConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanBenefitConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
