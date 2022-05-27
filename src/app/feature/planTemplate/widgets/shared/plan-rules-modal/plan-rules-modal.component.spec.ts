import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRulesModalComponent } from './plan-rules-modal.component';

describe('PlanRulesModalComponent', () => {
  let component: PlanRulesModalComponent;
  let fixture: ComponentFixture<PlanRulesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanRulesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanRulesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
