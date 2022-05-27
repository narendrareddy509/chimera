import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDepositComponent } from './fund-deposit.component';

describe('FundDepositComponent', () => {
  let component: FundDepositComponent;
  let fixture: ComponentFixture<FundDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
