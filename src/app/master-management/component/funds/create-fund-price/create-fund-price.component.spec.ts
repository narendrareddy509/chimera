import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFundPriceComponent } from './create-fund-price.component';

describe('CreateFundPriceComponent', () => {
  let component: CreateFundPriceComponent;
  let fixture: ComponentFixture<CreateFundPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFundPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFundPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
