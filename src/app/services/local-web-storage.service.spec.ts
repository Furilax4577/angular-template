import { TestBed } from '@angular/core/testing';

import { LocalWebStorageService } from './local-web-storage.service';

describe('LocalWebStorageService', () => {
  let service: LocalWebStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalWebStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
