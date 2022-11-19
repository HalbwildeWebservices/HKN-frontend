import { TestBed } from '@angular/core/testing';

import { UserIdTransferService } from './user-id-transfer.service';

describe('UserIdTransferService', () => {
  let service: UserIdTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIdTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
