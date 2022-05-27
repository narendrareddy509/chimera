import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UwQuestionnaireComponent } from './uw-questionnaire.component';

describe('UwQuestionnaireComponent', () => {
  let component: UwQuestionnaireComponent;
  let fixture: ComponentFixture<UwQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UwQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UwQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
