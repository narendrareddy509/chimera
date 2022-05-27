import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundUploadComponent } from './fund-upload.component';

describe('FundUploadComponent', () => {
  let component: FundUploadComponent;
  let fixture: ComponentFixture<FundUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
