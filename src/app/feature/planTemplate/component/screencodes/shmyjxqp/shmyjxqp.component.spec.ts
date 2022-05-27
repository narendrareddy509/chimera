import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShmyjxqpComponent } from './shmyjxqp.component';

describe('ShmyjxqpComponent', () => {
  let component: ShmyjxqpComponent;
  let fixture: ComponentFixture<ShmyjxqpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShmyjxqpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShmyjxqpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
