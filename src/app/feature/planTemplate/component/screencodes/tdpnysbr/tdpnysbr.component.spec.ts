import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdpnysbrComponent } from './tdpnysbr.component';

describe('TdpnysbrComponent', () => {
  let component: TdpnysbrComponent;
  let fixture: ComponentFixture<TdpnysbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdpnysbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdpnysbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
