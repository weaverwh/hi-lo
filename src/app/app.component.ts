import { Component, OnInit } from '@angular/core';

import { DeckService } from './services/deck.service';

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

  title: string = 'Hi - Lo: Ultimate Edition';

  buildNewDeck = () => {
    console.log(this.deckService);
    this.deckService.fetchNewDeck()
    .subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  ngOnInit(){
    this.buildNewDeck();
  };

}
