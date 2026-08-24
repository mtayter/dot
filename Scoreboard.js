export default class Scoreboard {
    constructor(p1Card,p2Card,player1ScoreOutput,player2ScoreOutput) {
        this.p1Card = p1Card;
        this.p2Card = p2Card;
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1ScoreOutput = player1ScoreOutput;
        this.player2ScoreOutput = player2ScoreOutput;

    }
    switchActivePlayer(activePlayer) {
        if (activePlayer === 1) {
            p1Card.classList.add('active');
            p2Card.classList.remove('active');
        } else {
            p2Card.classList.add('active');
            p1Card.classList.remove('active');
        }
    }
    point(player) {
        if(player === 1) {
            this.player1Score++;
            this.player1ScoreOutput.textContent = this.player1Score;
        } else {
            this.player2Score++;
            this.player2ScoreOutput.textContent = this.player2Score;
        }
    }
    reset() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1ScoreOutput.textContent = this.player1Score;
        this.player2ScoreOutput.textContent = this.player2Score;
        this.switchActivePlayer(1);
    }
    whoWon() {
        if(this.player1Score > this.player2Score) {
            return 1;
        } else if(this.player2Score > this.player1Score) {
            return 2;
        } else {
            return 0;
        }
    }
}
