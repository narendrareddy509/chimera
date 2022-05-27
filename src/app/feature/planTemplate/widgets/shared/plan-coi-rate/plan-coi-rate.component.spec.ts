import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCoiRateComponent } from './plan-coi-rate.component';

describe('PlanCoiRateComponent', () => {
  let component: PlanCoiRateComponent;
  let fixture: ComponentFixture<PlanCoiRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCoiRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCoiRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
