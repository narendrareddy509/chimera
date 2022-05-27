import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLapsationReinstatementComponent } from './plan-lapsation-reinstatement.component';

describe('PlanLapsationReinstatementComponent', () => {
  let component: PlanLapsationReinstatementComponent;
  let fixture: ComponentFixture<PlanLapsationReinstatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanLapsationReinstatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanLapsationReinstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
