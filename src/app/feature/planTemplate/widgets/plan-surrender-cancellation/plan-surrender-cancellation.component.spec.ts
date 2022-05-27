import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSurrenderCancellationComponent } from './plan-surrender-cancellation.component';

describe('PlanSurrenderCancellationComponent', () => {
  let component: PlanSurrenderCancellationComponent;
  let fixture: ComponentFixture<PlanSurrenderCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSurrenderCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSurrenderCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
