import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsweahxfComponent } from './rsweahxf.component';

describe('RsweahxfComponent', () => {
  let component: RsweahxfComponent;
  let fixture: ComponentFixture<RsweahxfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsweahxfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsweahxfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
