import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRulesComponent } from './plan-rules.component';

describe('PlanRulesComponent', () => {
  let component: PlanRulesComponent;
  let fixture: ComponentFixture<PlanRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
