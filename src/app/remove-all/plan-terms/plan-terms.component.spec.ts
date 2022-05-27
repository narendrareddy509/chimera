import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTermsComponent } from './plan-terms.component';

describe('PlanTermsComponent', () => {
  let component: PlanTermsComponent;
  let fixture: ComponentFixture<PlanTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
