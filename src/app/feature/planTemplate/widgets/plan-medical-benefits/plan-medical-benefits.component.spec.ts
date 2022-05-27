import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMedicalBenefitsComponent } from './plan-medical-benefits.component';

describe('PlanMedicalBenefitsComponent', () => {
  let component: PlanMedicalBenefitsComponent;
  let fixture: ComponentFixture<PlanMedicalBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanMedicalBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMedicalBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
