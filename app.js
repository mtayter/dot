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
    const player1Type = document.getElementById('player1Type');
    const player2Type = document.getElementById('player2Type');
    const p1ThinkGroup = document.getElementById('p1ThinkGroup');
    const p2ThinkGroup = document.getElementById('p2ThinkGroup');
    const p1ThinkRange = document.getElementById('p1ThinkRange');
    const p2ThinkRange = document.getElementById('p2ThinkRange');
    const p1ThinkValue = document.getElementById('p1ThinkValue');
    const p2ThinkValue = document.getElementById('p2ThinkValue');
    const p1Iters = document.getElementById('p1Iters');
    const p2Iters = document.getElementById('p2Iters');
    const newGameButton = document.getElementById('newGameButton');
    const gameOverBanner = document.getElementById('gameOverBanner');
    const playAgainButton = document.getElementById('playAgainButton');
    let dotGame;
    let scoreboard = new Scoreboard(document.getElementById('p1Card'),
                                    document.getElementById('p2Card'),
                                    document.getElementById('player1Score'),
                                    document.getElementById('player2Score'));
    const fmtThink = (ms) => (ms / 1000).toFixed(1) + 's';
    const fmtIters = (n) => {
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M iters';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k iters';
        return n + ' iters';
    };
    // Each player's Think slider applies live to that player's engine.
    function makeThinkUpdater(range, value, playerIndex) {
        return () => {
            const ms = parseInt(range.value);
            value.textContent = fmtThink(ms);
            if (dotGame) {
                const p = dotGame.players[playerIndex];
                if (p.aiEngine) p.aiEngine.thinkMs = ms;
            }
        };
    }
    const updateP1Think = makeThinkUpdater(p1ThinkRange, p1ThinkValue, 0);
    const updateP2Think = makeThinkUpdater(p2ThinkRange, p2ThinkValue, 1);
    p1ThinkRange.addEventListener('input', updateP1Think);
    p1ThinkRange.addEventListener('change', updateP1Think);
    p2ThinkRange.addEventListener('input', updateP2Think);
    p2ThinkRange.addEventListener('change', updateP2Think);
    // Show a player's Think slider only when that player is AI-Hybrid.
    function updateThinkVisibility() {
        p1ThinkGroup.classList.toggle('hidden', player1Type.value !== 'ai-hybrid');
        p2ThinkGroup.classList.toggle('hidden', player2Type.value !== 'ai-hybrid');
    }
    player1Type.addEventListener('change', updateThinkVisibility);
    player2Type.addEventListener('change', updateThinkVisibility);
    updateThinkVisibility();
    heightRange.addEventListener('input', (e) => {
        heightValue.textContent = e.target.value;
    });
    widthRange.addEventListener('input', (e) => {
        widthValue.textContent = e.target.value;
    });
    function newGame() {
        // Stop the previous game's AI loop if it's still thinking: otherwise
        // the abandoned game keeps move()ing and rendering its old board
        // onto this same canvas.
        if (dotGame) dotGame.cancelled = true;
        const height = parseInt(heightRange.value);
        const width = parseInt(widthRange.value);
        const p1ThinkMs = parseInt(p1ThinkRange.value);
        const p2ThinkMs = parseInt(p2ThinkRange.value);
        const player1 = new Player('1','#BF616A','#E5B3B8',player1Type.value,p1ThinkMs);
        const player2 = new Player('2','#5E81AC','#88C0D0',player2Type.value,p2ThinkMs);
        gameOverBanner.classList.remove('show');
        p1Iters.textContent = '';
        p2Iters.textContent = '';
        dotGame = new DotGame(height,width,player1,player2,ctx,scoreboard, {
            onAIMove: (playerNum, iters, exact) => {
                const el = playerNum === 1 ? p1Iters : p2Iters;
                el.textContent = exact ? 'exact solve' : fmtIters(iters);
            }
        });
        scoreboard.reset();
        dotGame.render();
    }
    newGameButton.addEventListener('click', newGame);
    playAgainButton.addEventListener('click', newGame);
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
