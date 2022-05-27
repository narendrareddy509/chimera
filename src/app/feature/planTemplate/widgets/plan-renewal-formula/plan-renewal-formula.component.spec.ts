import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRenewalFormulaComponent } from './plan-renewal-formula.component';

describe('PlanRenewalFormulaComponent', () => {
  let component: PlanRenewalFormulaComponent;
  let fixture: ComponentFixture<PlanRenewalFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanRenewalFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanRenewalFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
