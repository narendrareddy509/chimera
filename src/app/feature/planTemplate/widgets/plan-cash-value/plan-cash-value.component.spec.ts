import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCashValueComponent } from './plan-cash-value.component';

describe('PlanCashValueComponent', () => {
  let component: PlanCashValueComponent;
  let fixture: ComponentFixture<PlanCashValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCashValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCashValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
