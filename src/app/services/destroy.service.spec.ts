import { TestBed } from '@angular/core/testing';

import { DestroyService } from './destroy.service';

describe('DestroyService', () => {
  let service: DestroyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new DestroyService();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should emit when destroyed', () => {
    service.life$.subscribe((s) => expect(s).toBeCalled());
    service.ngOnDestroy();
  });
});
