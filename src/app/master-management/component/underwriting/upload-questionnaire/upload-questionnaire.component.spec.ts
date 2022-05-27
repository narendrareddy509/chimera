import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadQuestionnaireComponent } from './upload-questionnaire.component';

describe('UploadQuestionnaireComponent', () => {
  let component: UploadQuestionnaireComponent;
  let fixture: ComponentFixture<UploadQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
