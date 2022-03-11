import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { Item, FILTERING_DATA, FilteringData, SearchResult, SearchResultStatus } from '../definitions';
import { FilterBaseComponent } from '../filter-base.component';
import { SearchService } from '../services/search.service';
import { DestroyService } from '../services/destroy.service';
import { takeUntil } from 'rxjs/operators';

export function favoriteListFactory(service: FavoritesService): FilteringData {
  return {
    dataSource: service.favorites$,
    filterFunction: ({ title }: Item, searchTerm: string): boolean => title.toLowerCase().includes(searchTerm.toLowerCase())
  };
}


@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss'],
  providers: [
    SearchService,
    {
      provide: FILTERING_DATA, useFactory: favoriteListFactory, deps: [FavoritesService]
    },
    DestroyService
  ]
})

export class FavoriteListComponent extends FilterBaseComponent implements OnInit {
  searchResult: SearchResult;
  SearchResultStatus = SearchResultStatus;

  constructor(public favoritesService: FavoritesService,
              private searchService: SearchService,
              private destroy$: DestroyService,
              private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.searchService.filterByTerm(this._search$)
        .pipe(takeUntil(this.destroy$))
        .subscribe((sr: SearchResult) => {
          this.searchResult = sr;
          this.cd.markForCheck();
        });
  }

  remove(favorite: Item) {
    this.favoritesService.toggleFavorite(favorite);
  }
}
