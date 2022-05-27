import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UwCategoriesComponent } from './uw-categories.component';

describe('UwCategoriesComponent', () => {
  let component: UwCategoriesComponent;
  let fixture: ComponentFixture<UwCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UwCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UwCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
