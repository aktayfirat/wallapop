import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FavoritesService } from './services/favorites.service';
import { MatDialog } from '@angular/material/dialog';
import { FavoriteListComponent } from './favorite-list/favorite-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  favoritesCount = 0;
  constructor(public favoriteService: FavoritesService,
              private cd: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.favoriteService.favorites$
        .subscribe(_ => {
          this.favoritesCount = _.length ?? 0;
          this.cd.markForCheck();
        });
  }

  openDialog() {
    this.dialog.open(FavoriteListComponent);
  }
}
