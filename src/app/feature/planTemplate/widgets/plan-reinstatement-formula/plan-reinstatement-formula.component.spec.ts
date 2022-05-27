import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanReinstatementFormulaComponent } from './plan-reinstatement-formula.component';

describe('PlanReinstatementFormulaComponent', () => {
  let component: PlanReinstatementFormulaComponent;
  let fixture: ComponentFixture<PlanReinstatementFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanReinstatementFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanReinstatementFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
