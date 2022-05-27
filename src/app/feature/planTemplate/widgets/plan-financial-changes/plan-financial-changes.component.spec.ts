import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFinancialChangesComponent } from './plan-financial-changes.component';

describe('PlanFinancialChangesComponent', () => {
  let component: PlanFinancialChangesComponent;
  let fixture: ComponentFixture<PlanFinancialChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanFinancialChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanFinancialChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
