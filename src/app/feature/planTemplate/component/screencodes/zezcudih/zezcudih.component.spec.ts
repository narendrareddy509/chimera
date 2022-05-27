import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZezcudihComponent } from './zezcudih.component';

describe('ZezcudihComponent', () => {
  let component: ZezcudihComponent;
  let fixture: ComponentFixture<ZezcudihComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZezcudihComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZezcudihComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
