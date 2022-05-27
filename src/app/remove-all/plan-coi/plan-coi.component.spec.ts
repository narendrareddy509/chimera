import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCoiComponent } from './plan-coi.component';

describe('PlanCoiComponent', () => {
  let component: PlanCoiComponent;
  let fixture: ComponentFixture<PlanCoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
