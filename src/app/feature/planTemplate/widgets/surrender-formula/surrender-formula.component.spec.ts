import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFormulaComponent } from './surrender-formula.component';

describe('PlanFormulaComponent', () => {
  let component: PlanFormulaComponent;
  let fixture: ComponentFixture<PlanFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
