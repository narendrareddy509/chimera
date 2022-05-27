import { TestBed } from '@angular/core/testing';

import { ChargeTableService } from './charge-table.service';

describe('ChargeTableService', () => {
  let service: ChargeTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargeTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
