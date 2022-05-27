import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSurrenderTermLifeComponent } from './plan-surrender-term-life.component';

describe('PlanSurrenderTermLifeComponent', () => {
  let component: PlanSurrenderTermLifeComponent;
  let fixture: ComponentFixture<PlanSurrenderTermLifeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSurrenderTermLifeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSurrenderTermLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
