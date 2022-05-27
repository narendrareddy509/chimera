import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDeathBenefitsTakafulIlasComponent } from './plan-death-benefits-takaful-ilas.component';

describe('PlanDeathBenefitsTakafulIlasComponent', () => {
  let component: PlanDeathBenefitsTakafulIlasComponent;
  let fixture: ComponentFixture<PlanDeathBenefitsTakafulIlasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDeathBenefitsTakafulIlasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDeathBenefitsTakafulIlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
