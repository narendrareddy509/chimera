import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCoiTermLifeComponent } from './plan-coi-term-life.component';

describe('PlanCoiTermLifeComponent', () => {
  let component: PlanCoiTermLifeComponent;
  let fixture: ComponentFixture<PlanCoiTermLifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCoiTermLifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCoiTermLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
