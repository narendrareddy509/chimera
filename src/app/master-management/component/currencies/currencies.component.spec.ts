import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrienciesComponent } from './currencies.component';

describe('CurrienciesComponent', () => {
  let component: CurrienciesComponent;
  let fixture: ComponentFixture<CurrienciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrienciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrienciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
