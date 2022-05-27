import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFormulasListComponent } from './plan-formulas-list.component';

describe('PlanFormulasListComponent', () => {
  let component: PlanFormulasListComponent;
  let fixture: ComponentFixture<PlanFormulasListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanFormulasListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanFormulasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
