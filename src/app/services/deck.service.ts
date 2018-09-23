import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface DeckResponse {
  "success": boolean,
  "deck_id": string,
  "shuffled": boolean,
  "remaining": number
}

@Injectable({
  providedIn: 'root'
})

export class DeckService {

  constructor(
    private http: HttpClient
  ) {}

  private deckUrl: string = 'https://deckofcardsapi.com/api/deck/';
  private deckId: string = '';

  fetchNewDeck() {
    return this.http.get(this.deckUrl + 'new/shuffle/?deck_count=1');
  }

  fetchCard() {
    return this.http.get(this.deckUrl + this.deckId + '/draw/?count=1');
  }

  setDeckId(deck_id) {
    this.deckId = deck_id;
  }

}
