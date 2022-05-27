import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundWithdrawalComponent } from './fund-withdrawal.component';

describe('FundWithdrawalComponent', () => {
  let component: FundWithdrawalComponent;
  let fixture: ComponentFixture<FundWithdrawalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundWithdrawalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
