import { TestBed } from '@angular/core/testing';

import { BrowserGuard } from './browser.guard';

describe('BrowserGuard', () => {
  let guard: BrowserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BrowserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
