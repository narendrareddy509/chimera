import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XsgwuwyoComponent } from './xsgwuwyo.component';

describe('XsgwuwyoComponent', () => {
  let component: XsgwuwyoComponent;
  let fixture: ComponentFixture<XsgwuwyoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XsgwuwyoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XsgwuwyoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
