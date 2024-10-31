import { TestBed } from '@angular/core/testing';

import { OAuthGoogleService } from './oauth-google.service';

describe('OAuthGoogleService', () => {
  let service: OAuthGoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OAuthGoogleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
