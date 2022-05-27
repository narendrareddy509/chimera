import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanModulesListComponent } from './plan-modules-list.component';

describe('PlanModulesListComponent', () => {
  let component: PlanModulesListComponent;
  let fixture: ComponentFixture<PlanModulesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanModulesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanModulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
