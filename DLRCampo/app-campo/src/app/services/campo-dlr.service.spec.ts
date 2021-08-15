import { TestBed } from '@angular/core/testing';

import { CampoDlrService } from './campo-dlr.service';

describe('CampoDlrService', () => {
  let service: CampoDlrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampoDlrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
