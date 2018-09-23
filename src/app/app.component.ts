import { Component, OnInit } from '@angular/core';

import { DeckService, DeckResponse } from './services/deck.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DeckService]
})

export class AppComponent implements OnInit {

  constructor(
    private deckService: DeckService
  ) {}

  buildNewDeck = () => {
    console.log(this.deckService);
    this.deckService.fetchNewDeck()
    .subscribe(
      (response: DeckResponse) => {
        this.deckService.setDeckId(response.deck_id);
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  drawCard = () => {
    this.deckService.fetchCard()
    .subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    )
  };

  ngOnInit() {
    this.buildNewDeck();
  };

}
