import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedPlansComponent } from './published-plans.component';

describe('PublishedPlansComponent', () => {
  let component: PublishedPlansComponent;
  let fixture: ComponentFixture<PublishedPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
