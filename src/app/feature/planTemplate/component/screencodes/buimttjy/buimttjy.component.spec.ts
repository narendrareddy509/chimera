import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuimttjyComponent } from './buimttjy.component';

describe('BuimttjyComponent', () => {
  let component: BuimttjyComponent;
  let fixture: ComponentFixture<BuimttjyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuimttjyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuimttjyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
