import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetjegemComponent } from './retjegem.component';

describe('RetjegemComponent', () => {
  let component: RetjegemComponent;
  let fixture: ComponentFixture<RetjegemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetjegemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetjegemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
