import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLapsationComponent } from './plan-lapsation.component';

describe('PlanLapsationComponent', () => {
  let component: PlanLapsationComponent;
  let fixture: ComponentFixture<PlanLapsationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanLapsationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanLapsationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
