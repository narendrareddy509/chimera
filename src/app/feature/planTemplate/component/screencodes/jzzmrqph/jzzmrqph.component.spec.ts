import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JzzmrqphComponent } from './jzzmrqph.component';

describe('JzzmrqphComponent', () => {
  let component: JzzmrqphComponent;
  let fixture: ComponentFixture<JzzmrqphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JzzmrqphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JzzmrqphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
