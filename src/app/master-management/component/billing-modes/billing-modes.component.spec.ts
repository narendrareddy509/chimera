import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingModesComponent } from './billing-modes.component';

describe('BillingModesComponent', () => {
  let component: BillingModesComponent;
  let fixture: ComponentFixture<BillingModesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingModesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
