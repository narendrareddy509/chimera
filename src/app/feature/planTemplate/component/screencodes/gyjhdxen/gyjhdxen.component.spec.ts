import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GyjhdxenComponent } from './gyjhdxen.component';

describe('GyjhdxenComponent', () => {
  let component: GyjhdxenComponent;
  let fixture: ComponentFixture<GyjhdxenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GyjhdxenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GyjhdxenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
