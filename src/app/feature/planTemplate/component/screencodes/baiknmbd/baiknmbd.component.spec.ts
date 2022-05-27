import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaiknmbdComponent } from './baiknmbd.component';

describe('BaiknmbdComponent', () => {
  let component: BaiknmbdComponent;
  let fixture: ComponentFixture<BaiknmbdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaiknmbdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaiknmbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
