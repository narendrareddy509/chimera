import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanParametersNavigationComponent } from './plan-parameters-navigation.component';

describe('PlanParametersNavigationComponent', () => {
  let component: PlanParametersNavigationComponent;
  let fixture: ComponentFixture<PlanParametersNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanParametersNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanParametersNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
