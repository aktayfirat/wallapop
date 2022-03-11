import { Injectable, Inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Item, FILTERING_DATA, FilteringData, SearchResult, SearchResultStatus, LOADING_RESULT } from '../definitions';
import { startWith, map, distinctUntilChanged, shareReplay, debounceTime } from 'rxjs/operators';

@Injectable()
export class SearchService {
    constructor(@Inject(FILTERING_DATA) private filteringData: FilteringData) {
    }

    filterByTerm(search$: Observable<string>): Observable<SearchResult> {
        return combineLatest([
            this.filteringData.dataSource,
            search$.pipe(
                debounceTime(250),
                startWith('')
            )
        ])
            .pipe(
                map(([items, term]: [Array<Item>, string]) => {
                    const filteredItems = items.filter(item => this.filteringData.filterFunction(item, term));
                    return {
                        filteredItems,
                        totalItemsCount: items.length,
                        status: !items.length
                            ? SearchResultStatus.EmptyDataSource
                            : !filteredItems.length
                                ? SearchResultStatus.EmptyByFilter
                                : SearchResultStatus.Ok
                    } as SearchResult;
                }),
                distinctUntilChanged(),
                shareReplay({refCount: true}),
                startWith(LOADING_RESULT),
            );
    }
}
