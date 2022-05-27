import { TestBed } from '@angular/core/testing';

import { FormulaTableService } from './formula-table.service';

describe('FormulaTableService', () => {
  let service: FormulaTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulaTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
