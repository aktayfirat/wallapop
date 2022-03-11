import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    const http = TestBed.inject(HttpClient);
    service = new ItemService(http);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should return an array fo 20 items', () => {
    service.getItems().subscribe(r => expect(r).toHaveLength(20));
  });

});
