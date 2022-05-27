import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCoiTakafulIlasComponent } from './plan-coi-takaful-ilas.component';

describe('PlanCoiTakafulIlasComponent', () => {
  let component: PlanCoiTakafulIlasComponent;
  let fixture: ComponentFixture<PlanCoiTakafulIlasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCoiTakafulIlasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCoiTakafulIlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
