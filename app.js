import DotGame from './DotGame.js';
import Player from './Player.js';
import Scoreboard from './Scoreboard.js';

function init() {
    const canvas = document.getElementById('board');
    const parentContainer = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const heightRange = document.getElementById('heightRange');
    const widthRange = document.getElementById('widthRange');
    const heightValue = document.getElementById('heightValue');
    const widthValue = document.getElementById('widthValue');
    const newGameButton = document.getElementById('newGameButton');
    let dotGame;
    let player1 = new Player('1','#BF616A','#E5B3B8');
    let player2 = new Player('2','#5E81AC','#88C0D0');
    const p1Card = document.getElementById('p1Card');
    const p2Card = document.getElementById('p2Card');
    const player1Score = document.getElementById('player1Score');
    const player2Score = document.getElementById('player2Score');
    let scoreboard = new Scoreboard(p1Card,p2Card,player1Score,player2Score);
    heightRange.addEventListener('input', (e) => {
        heightValue.textContent = e.target.value;
    });
    widthRange.addEventListener('input', (e) => {
        widthValue.textContent = e.target.value;
    });
    newGameButton.addEventListener('click', () => {
        dotGame = new DotGame(parseInt(heightRange.value),parseInt(widthRange.value),player1,player2,ctx,scoreboard);
        scoreboard.reset();
        console.dir(dotGame);
        dotGame.render();
    });
    function handleResize() {
        canvas.width = parentContainer.clientWidth;
        canvas.height= parentContainer.clientHeight;
        render();
    }
    function render() {
        if(dotGame) {
            dotGame.render();
        }
    }
    window.addEventListener('resize', handleResize)
    handleResize();
}

init();