import { Component, OnInit } from '@angular/core';

import { DeckService, DeckResponse, DrawResponse } from './services/deck.service';

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

  drawnCards: any = [];
  numberOfCards: number = 0;

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
      (response: DrawResponse) => {
        console.log(response);
        this.drawnCards.push(response.cards[0]);
        this.numberOfCards = this.drawnCards.length;
        setTimeout(() => {
          if (this.numberOfCards > 1) {
            this.drawnCards[this.numberOfCards - 2].discarding = true;
            setTimeout(() => {
              this.drawnCards[this.numberOfCards - 2].discarded = true;
              this.displayNewCard();
            }, 500);
          } else {
            this.displayNewCard();
          }
        }, 10);
      },
      (error) => {
        console.log(error);
      }
    )
  };

  displayNewCard = () => {
    this.drawnCards[this.numberOfCards - 1].active = true;
  };

  ngOnInit() {
    this.buildNewDeck();
  };

}
