import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HewjbadxComponent } from './hewjbadx.component';

describe('HewjbadxComponent', () => {
  let component: HewjbadxComponent;
  let fixture: ComponentFixture<HewjbadxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HewjbadxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HewjbadxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
