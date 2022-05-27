import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCancellationComponent } from './plan-cancellation.component';

describe('PlanCancellationComponent', () => {
  let component: PlanCancellationComponent;
  let fixture: ComponentFixture<PlanCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
