import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../definitions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {
  }

  getItems(): Observable<Array<Item>> {
    return this.http.get<{items: Array<Item>}>('https://frontend-tech-test-data.s3.eu-west-1.amazonaws.com/items.json')
        .pipe(map(({items}) => items));
  }
}
