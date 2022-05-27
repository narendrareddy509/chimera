import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDividendComponent } from './plan-dividend.component';

describe('PlanDividendComponent', () => {
  let component: PlanDividendComponent;
  let fixture: ComponentFixture<PlanDividendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDividendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDividendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
