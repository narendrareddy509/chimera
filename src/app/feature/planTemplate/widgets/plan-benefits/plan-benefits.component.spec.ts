import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanBenefitsComponent } from './plan-benefits.component';

describe('PlanBenefitsComponent', () => {
  let component: PlanBenefitsComponent;
  let fixture: ComponentFixture<PlanBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
