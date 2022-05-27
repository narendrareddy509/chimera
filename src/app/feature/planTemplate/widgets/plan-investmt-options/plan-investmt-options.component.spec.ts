import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanInvestmtOptionsComponent } from './plan-investmt-options.component';

describe('PlanInvestmtOptionsComponent', () => {
  let component: PlanInvestmtOptionsComponent;
  let fixture: ComponentFixture<PlanInvestmtOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanInvestmtOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanInvestmtOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
