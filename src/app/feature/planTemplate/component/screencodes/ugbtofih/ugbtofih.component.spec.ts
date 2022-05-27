import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UgbtofihComponent } from './ugbtofih.component';

describe('UgbtofihComponent', () => {
  let component: UgbtofihComponent;
  let fixture: ComponentFixture<UgbtofihComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UgbtofihComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UgbtofihComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
