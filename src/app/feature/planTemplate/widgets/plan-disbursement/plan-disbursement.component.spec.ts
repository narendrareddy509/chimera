import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDisbursementComponent } from './plan-disbursement.component';

describe('PlanDisbursementComponent', () => {
  let component: PlanDisbursementComponent;
  let fixture: ComponentFixture<PlanDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
