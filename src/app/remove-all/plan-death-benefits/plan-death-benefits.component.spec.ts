import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDeathBenefitsComponent } from './plan-death-benefits.component';

describe('PlanDeathBenefitsComponent', () => {
  let component: PlanDeathBenefitsComponent;
  let fixture: ComponentFixture<PlanDeathBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDeathBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDeathBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
