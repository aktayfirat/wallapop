import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';
import { FILTERING_DATA, SearchResult, FilteringData, EMPTY_ITEM, Item, SearchResultStatus, LOADING_RESULT } from '../definitions';
import { Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';

export const testingFilteringData = (items: Array<Item>): FilteringData => ({
  dataSource: of(items),
  filterFunction: ({ title }: Item, searchTerm: string): boolean => title.toLowerCase().includes(searchTerm.toLowerCase())
});

export const DEFAULT_SEARCH_RESULT: SearchResult = {
  totalItemsCount: 1,
  filteredItems: [EMPTY_ITEM],
  status: SearchResultStatus.Ok
};

export const NO_SEARCH_RESULT: SearchResult = {
  totalItemsCount: 0,
  filteredItems: [],
  status: SearchResultStatus.EmptyByFilter
};

describe('SearchService', () => {
  let service: SearchService;
  let search$: Subject<string>;
  let filteringData: FilteringData;

  describe('Empty datasource', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: FILTERING_DATA, useValue: testingFilteringData([]) }
        ]
      });
      filteringData = TestBed.inject(FILTERING_DATA);
      service = new SearchService(filteringData);
      search$ = new Subject<string>();
    });

    test('Should be created', () => {
      expect(service).toBeTruthy();
    });

    test('Empty data source should return EmptyDataSource status', () => {
      service.filterByTerm(search$)
             .subscribe((sr: SearchResult) => expect(sr).toEqual({
               filteredItems: [],
               status: SearchResultStatus.EmptyDataSource,
               totalItemsCount: 0
             } as SearchResult));
    });
  });

  describe('Not empty datasource', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: FILTERING_DATA, useValue: testingFilteringData([EMPTY_ITEM]) }]
      });
      filteringData = TestBed.inject(FILTERING_DATA);
      service = new SearchService(filteringData);
      search$ = new Subject<string>();
    });

    test('should start with loading state', () => {
      service.filterByTerm(search$)
             .pipe(take(1))
             .subscribe((sr: SearchResult) => expect(sr).toEqual(LOADING_RESULT));
    });

    test('Empty data source should EmptyDataSource status', () => {
      service.filterByTerm(search$)
             .subscribe((sr: SearchResult) => expect(sr).toEqual(DEFAULT_SEARCH_RESULT));
    });

    test('should return the original data source', () => {
      service.filterByTerm(search$)
             .subscribe((sr: SearchResult) => expect(sr).toEqual(DEFAULT_SEARCH_RESULT));
    });

    test('Included search term should return some results', () => {
      search$.next('tit');
      service.filterByTerm(search$)
             .subscribe((sr: SearchResult) => {
               expect(sr.filteredItems.length).toBeGreaterThan(0);
               expect(sr).toEqual(DEFAULT_SEARCH_RESULT);
             });
    });

    test('Not included search term should return no results', () => {
      search$.next('/');
      service.filterByTerm(search$)
             .subscribe((sr: SearchResult) => {
               expect(sr.filteredItems.length).toEqual(0);
               expect(sr).toEqual(NO_SEARCH_RESULT);
             });
    });
  });
});