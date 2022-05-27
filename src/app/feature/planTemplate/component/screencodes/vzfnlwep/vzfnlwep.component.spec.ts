import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VzfnlwepComponent } from './vzfnlwep.component';

describe('VzfnlwepComponent', () => {
  let component: VzfnlwepComponent;
  let fixture: ComponentFixture<VzfnlwepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VzfnlwepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VzfnlwepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
