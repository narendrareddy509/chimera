import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSurrenderRateTableComponent } from './plan-surrender-rate-table.component';

describe('PlanSurrenderRateTableComponent', () => {
  let component: PlanSurrenderRateTableComponent;
  let fixture: ComponentFixture<PlanSurrenderRateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSurrenderRateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSurrenderRateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
