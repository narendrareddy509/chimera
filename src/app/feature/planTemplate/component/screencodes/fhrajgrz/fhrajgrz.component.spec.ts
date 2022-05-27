import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhrajgrzComponent } from './fhrajgrz.component';

describe('FhrajgrzComponent', () => {
  let component: FhrajgrzComponent;
  let fixture: ComponentFixture<FhrajgrzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhrajgrzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhrajgrzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
