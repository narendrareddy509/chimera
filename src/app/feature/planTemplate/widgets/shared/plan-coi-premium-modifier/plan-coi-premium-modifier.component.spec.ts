import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCoiPremiumModifierComponent } from './plan-coi-premium-modifier.component';

describe('PlanCoiPremiumModifierComponent', () => {
  let component: PlanCoiPremiumModifierComponent;
  let fixture: ComponentFixture<PlanCoiPremiumModifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCoiPremiumModifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCoiPremiumModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
