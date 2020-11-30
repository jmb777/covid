import { TestBed } from '@angular/core/testing';

import { PheService } from './phe.service';

describe('PheService', () => {
  let service: PheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
