let blackjack = {
    'you': {'scoreSpan': '#you-blackjack-outcome', 'div': '#you-box', 'cardsSum': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-outcome', 'div': '#dealer-box', 'cardsSum': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardValue': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'Stand': false,
    'gameEnded': false,
};

const YOU = blackjack['you'];
const DEALER = blackjack['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#hit-button').addEventListener('click',blackjackHit);
document.querySelector('#stand-button').addEventListener('click',blackjackStand);
document.querySelector('#deal-button').addEventListener('click',blackjackDeal);

function blackjackHit() {
    if(blackjack['Stand'] === false) {
        let card = randomizeCard();
        displayCard(card, YOU);
        cardsTally(card, YOU);
        displayCardsSum(YOU);
    }  
}

function randomizeCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjack['cards'][randomIndex];
}

function displayCard(card, activePlayer) {
    if(activePlayer['cardsSum'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    if(blackjack['gameEnded'] === true ) {
        blackjack['Stand'] = false;

        let youImages = document.querySelector('#you-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for(i=0; i< youImages.length; i++) {
            youImages[i].remove();
        }

        for(i=0; i< dealerImages.length; i++) {
            dealerImages[i].remove();
        }  

        YOU['cardsSum'] = 0;
        DEALER['cardsSum'] = 0;

        document.querySelector('#you-blackjack-outcome').textContent = 0;
        document.querySelector('#dealer-blackjack-outcome').textContent = 0;

        document.querySelector('#you-blackjack-outcome').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-outcome').style.color = '#ffffff';

        document.querySelector('#blackjack-outcome').textContent = "Let's start the game again";
        document.querySelector('#blackjack-outcome').style.color = "black";

        blackjack['gameEnded'] = true;
    }
}

function cardsTally(card, activePlayer) {
    if (card == 'A') {
        if (activePlayer['cardsSum'] + blackjack['cardValue'][card][1] <=21 ) {
            activePlayer['cardsSum'] += blackjack['cardValue'][card][1];
        } else {
            activePlayer['cardsSum'] += blackjack['cardValue'][card][0];
        }
    } else {
        activePlayer['cardsSum'] += blackjack['cardValue'][card];
    }
}

function displayCardsSum(activePlayer) {
    if (activePlayer['cardsSum'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['cardsSum'];
    }
}

function time(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function blackjackStand() {
    blackjack['Stand'] = true;

    while(DEALER['cardsSum'] < 16 && blackjack['Stand'] === true) {
        let card = randomizeCard();
        displayCard(card, DEALER);
        cardsTally(card, DEALER);
        displayCardsSum(DEALER);
        await time(1000);
    }

    blackjack['gameEnded'] = true;
    displayText(determineWinner());
}

function determineWinner() {
    let winner;

    if(YOU['cardsSum'] <= 21) {
        if(YOU['cardsSum'] > DEALER['cardsSum'] || DEALER['cardsSum'] > 21) {
            blackjack['wins']++;
            winner = YOU;

        } else if (YOU['cardsSum'] < DEALER['cardsSum']) {
            blackjack['losses']++;
            winner = DEALER;
        
        }else if (YOU['cardsSum'] === DEALER['cardsSum']) {
            blackjack['draws']++;
        }
    } else if (YOU['cardsSum'] > 21 && DEALER['cardsSum'] <= 21) {
        blackjack['losses']++;
        winner = DEALER;

    } else if (YOU['cardsSum'] > 21 && DEALER['cardsSum'] > 21) {
        blackjack['draws']++;
    }
    return winner;
}

function displayText(winner) {
    let text, textColor; 

    if (blackjack['gameEnded'] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjack['wins'];
            text = 'YAY, YOU WON! Play Again';
            textColor = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjack['losses'];
            text = 'SORRY, YOU LOST! Better luck next time';
            textColor = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjack['draws'];
            text = 'SORRY, YOU DREW! Want to try again';
            textColor = 'yellow';
            lossSound.play();
        }

        document.querySelector('#blackjack-outcome').textContent = text;
        document.querySelector('#blackjack-outcome').style.color = textColor;
    }
}