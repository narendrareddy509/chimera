import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCsvTableComponent } from './import-csv-table.component';

describe('UploadRateTableComponent', () => {
  let component: ImportCsvTableComponent;
  let fixture: ComponentFixture<ImportCsvTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCsvTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCsvTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
