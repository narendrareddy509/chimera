import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComissionsComponent } from './plan-comissions.component';

describe('PlanComissionsComponent', () => {
  let component: PlanComissionsComponent;
  let fixture: ComponentFixture<PlanComissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanComissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
