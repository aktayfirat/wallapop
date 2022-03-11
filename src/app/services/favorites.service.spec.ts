import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { EMPTY_ITEM } from '../definitions';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('FavoritesService ', () => {
    test('should have 0 favorites when created', () => {
      service.favorites$.subscribe((r) => expect(r).toEqual([]));
    });

    test('should have 1 favorite when toggling once after its creation', () => {
      service.toggleFavorite(EMPTY_ITEM);

      service.favorites$.subscribe((_) => expect(_).toHaveLength(1));
    });

    test('should contain an empty array when toggling same item twice', () => {
      service.toggleFavorite(EMPTY_ITEM);
      service.toggleFavorite(EMPTY_ITEM);

      service.favorites$.subscribe((_) => expect(_).toEqual([]));
    });
  });
});
