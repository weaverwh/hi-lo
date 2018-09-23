import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(
    private http: HttpClient
  ) {}

  deckUrl: string = 'https://deckofcardsapi.com/api/deck/';

  fetchNewDeck() {
    return this.http.get(this.deckUrl + 'new/shuffle/?deck_count=1');
  }

}
