import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KfbtvvclComponent } from './kfbtvvcl.component';

describe('KfbtvvclComponent', () => {
  let component: KfbtvvclComponent;
  let fixture: ComponentFixture<KfbtvvclComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KfbtvvclComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KfbtvvclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
