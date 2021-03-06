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
  gameMessage: string = 'Draw a card to start playing!';
  guessCorrect: boolean = true;
  encourager: string = 'Good!';
  numberOfCorrectGuesses: number = 0;
  numberOfRemainingCards: number = 52;

  player1: any = {
    score: 0,
    turnActive: true
  };

  player2: any = {
    score: 0,
    turnActive: false
  };

  buildNewDeck = () => {
    this.deckService.fetchNewDeck()
    .subscribe(
      (response: DeckResponse) => {
        this.deckService.setDeckId(response.deck_id);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  drawCard = (guess) => {
    this.deckService.fetchCard()
    .subscribe(
      (response: DrawResponse) => {
        switch (response.cards[0].value) {
          case 'JACK':
            response.cards[0].rawValue = 11;
            break;
          case 'QUEEN':
            response.cards[0].rawValue = 12;
            break;
          case 'KING':
            response.cards[0].rawValue = 13;
            break;
          case 'ACE':
            response.cards[0].rawValue = 14;
            break;
          default:
            response.cards[0].rawValue = parseInt(response.cards[0].value);
            break;
        }
        switch (response.cards[0].suit) {
          case 'SPADES':
            response.cards[0].suitIcon = '♠';
            break;
          case 'CLUBS':
            response.cards[0].suitIcon = '♣';
            break;
          case 'DIAMONDS':
            response.cards[0].suitIcon = '♦';
            break;
          case 'HEARTS':
            response.cards[0].suitIcon = '♥';
            break;
        }
        this.drawnCards.push(response.cards[0]);
        this.numberOfRemainingCards--;
        this.numberOfCards = this.drawnCards.length;
        if (this.numberOfCards > 1) {
          if (guess === 'higher' && this.drawnCards[this.numberOfCards -1].rawValue > this.drawnCards[this.numberOfCards - 2].rawValue) {
            this.handleCorrectGuess();
          } else if (guess === 'lower' && this.drawnCards[this.numberOfCards -1].rawValue < this.drawnCards[this.numberOfCards - 2].rawValue) {
            this.handleCorrectGuess();
          } else {
            this.handleIncorrectGuess();
          }
        } else {
          this.guessCorrect = true;
        }
        this.updateGameMessage(false);
        setTimeout(() => {
          this.displayNewCard();
        }, 10);
      },
      (error) => {
        console.log(error);
      }
    )
  };

  displayNewCard = () => {
    if (this.numberOfCards > 1) {
      this.drawnCards[this.numberOfCards - 2].played = true;
      setTimeout(() => {
        this.activateCard();
      }, 250);
    } else {
      this.activateCard();
    }
  };

  activateCard = () => {
    this.drawnCards[this.numberOfCards - 1].active = true;
    setTimeout(() => {
      this.drawnCards[this.numberOfCards - 1].suitIconActive = true;
    }, 250);
  };

  guessHigher = () => {
    this.drawCard('higher');
  };

  guessLower = () => {
    this.drawCard('lower');
  };

  pass = () => {
    this.player1.turnActive = !this.player1.turnActive;
    this.player2.turnActive = !this.player2.turnActive;
    this.numberOfCorrectGuesses = 0;
    this.updateGameMessage(true)
  };

  handleCorrectGuess = () => {
    this.guessCorrect = true;
    this.numberOfCorrectGuesses++;
  };

  handleIncorrectGuess = () => {
    this.guessCorrect = false;
    this.numberOfCorrectGuesses = 0;
    if (this.numberOfRemainingCards > 0) {
      setTimeout(() => {
        this.discardStack();
      }, 1500);
    }
  };

  discardStack = () => {
    this.drawnCards[this.numberOfCards - 1].discarding = true;
    setTimeout(() => {
      this.drawnCards[this.numberOfCards - 1].discarded = true;
      this.updateScore();
      this.drawnCards = [];
      this.numberOfCards = 0;
    }, 500);
  };

  updateScore = () => {
    if (this.player1.turnActive) {
      this.player1.score += this.numberOfCards;
      this.player1.turnActive = false;
      this.player2.turnActive = true;
    } else if (this.player2.turnActive) {
      this.player2.score += this.numberOfCards;
      this.player2.turnActive = false;
      this.player1.turnActive = true;
    }
  };

  updateGameMessage = (pass) => {
    if (this.numberOfRemainingCards === 0) {
      this.gameOver();
    } else {
      if (this.numberOfCards > 1) {
        if (pass) {
          this.gameMessage = 'Passed! Keep drawing!';
        } else {
          if (this.guessCorrect) {
            let message: string = 'Correct!';
            if (this.numberOfCorrectGuesses > 1) {
              message += ' ' + this.numberOfCorrectGuesses + ' guesses in a row!';
              this.updateEncourager();
            }
            this.gameMessage = message;
          } else {
            this.gameMessage = 'Woops! Wrong guess!';
          }
        }
      } else {
        this.gameMessage = 'Good luck!';
      }
    }
  };

  updateEncourager = () => {
    switch (this.numberOfCorrectGuesses) {
      case 2:
        this.encourager = 'Good!';
        break;
      case 3:
        this.encourager = 'Great!';
        break;
      case 4:
        this.encourager = 'Excellent!';
        break;
      case 5:
        this.encourager = 'Awesome!';
        break;
      case 6:
        this.encourager = 'Superb!';
        break;
      case 7:
        this.encourager = 'Incredible!';
        break;
      case 8:
        this.encourager = 'Outstanding!';
        break;
      case 9:
        this.encourager = 'Unbelievable!';
        break;
      default:
        this.encourager = 'Have mercy!';
    }
  };

  gameOver = () => {
    if (this.player1.score < this.player2.score) {
      this.gameMessage = 'Game Over! Player 1 Wins!';
    } else if (this.player1.score > this.player2.score) {
      this.gameMessage = 'Game Over! Player 2 Wins!';
    } else if (this.player1.score === this.player2.score) {
      this.gameMessage = 'Game Over! We have a tie!';
    }
    this.guessCorrect = false;
  };

  resetGame = () => {
    if (this.drawnCards.length > 0) {
      this.discardStack();
      setTimeout(() => {
        this.resetApp();
      }, 500);
    } else {
      this.resetApp();
    }
  };

  resetApp = () => {
    this.drawnCards = [];
    this.numberOfCards = 0;
    this.gameMessage = 'Draw a card to start playing!';
    this.guessCorrect = true;
    this.encourager = '';
    this.numberOfCorrectGuesses = 0;
    this.numberOfRemainingCards = 52;
    this.player1 = {
      score: 0,
      turnActive: true
    };
    this.player2 = {
      score: 0,
      turnActive: false
    };
    this.buildNewDeck();
  };

  ngOnInit() {
    this.buildNewDeck();
  };

}
