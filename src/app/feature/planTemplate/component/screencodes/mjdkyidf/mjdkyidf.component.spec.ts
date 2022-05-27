import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MjdkyidfComponent } from './mjdkyidf.component';

describe('MjdkyidfComponent', () => {
  let component: MjdkyidfComponent;
  let fixture: ComponentFixture<MjdkyidfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MjdkyidfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MjdkyidfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
