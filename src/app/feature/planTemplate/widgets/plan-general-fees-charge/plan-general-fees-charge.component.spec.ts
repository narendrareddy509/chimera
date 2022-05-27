import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanGeneralFeesChargeComponent } from './plan-general-fees-charge.component';

describe('PlanGeneralFeesChargeComponent', () => {
  let component: PlanGeneralFeesChargeComponent;
  let fixture: ComponentFixture<PlanGeneralFeesChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanGeneralFeesChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanGeneralFeesChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
