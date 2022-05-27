import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSurrenderComponent } from './plan-surrender.component';

describe('PlanSurrenderComponent', () => {
  let component: PlanSurrenderComponent;
  let fixture: ComponentFixture<PlanSurrenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSurrenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSurrenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
