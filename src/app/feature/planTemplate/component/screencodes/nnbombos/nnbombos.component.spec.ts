import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NnbombosComponent } from './nnbombos.component';

describe('NnbombosComponent', () => {
  let component: NnbombosComponent;
  let fixture: ComponentFixture<NnbombosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NnbombosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NnbombosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
