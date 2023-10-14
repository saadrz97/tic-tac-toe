import View from './view.js';

const app = {
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        turn: document.querySelector('[data-id="turn"]')

    },

    state: {
        moves: [],
    },

    getGameStatus(moves) {
        const p1Moves = moves.filter((move) => move.playerId === 1).map((move) => +move.squareId)
        const p2Moves = moves.filter((move) => move.playerId === 2).map((move) => +move.squareId)
        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [4, 5, 6],
            [7, 8, 9],
            [3, 6, 9],
            [7, 5, 3],
        ]
        let winner = null;
        winningPatterns.forEach(pattern => {
            const p1Wins = pattern.every(v => p1Moves.includes(v))
            const p2Wins = pattern.every(v => p2Moves.includes(v))

            if (p1Wins) winner = 1
            if (p2Wins) winner = 2

        })
    return {
        status: moves.length === 9 || winner != null ? 'complete' : 'in progress',
        winner
    };

    },

    init: () =>{
        app.registerEventListners ()
    },

    registerEventListners: () => {

        app.$.menu.addEventListener("click", (event) =>{
           app.$.menuItems.classList.toggle("hidden"); 
        });

        app.$.modalBtn.addEventListener("click", (event) => {
            app.state.moves = [];
            app.$.squares.forEach(square => {
                square.replaceChildren()
            });
            app.$.modal.classList.add("hidden");
        })

        app.$.resetBtn.addEventListener("click", (event) => {
            console.log('the game will reset');
        });

        app.$.newRoundBtn.addEventListener("click", (event) => {
            console.log('A new game will start');
        });
        
        app.$.squares.forEach(square => {
            square.addEventListener("click", event => {
            const hasMove = (squareId) => {
                const existingMove = app.state.moves.find(
                    (move) => move.squareId === squareId);
                    return existingMove !== undefined
            };
            if (hasMove(+square.id)) {
                return;
            }
            const lastMove = app.state.moves.at(-1);
            const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1)
            const currentPlayer = app.state.moves.length === 0 ? 1 : getOppositePlayer(lastMove.playerId);

            const nextPlayer = getOppositePlayer(currentPlayer);
            const icon = document.createElement('i');
            const turnIcon = document.createElement('i');
            const turnLabel = document.createElement('p');
            turnLabel.textContent = 'Player ' + nextPlayer + ', you are up'
           
            if (currentPlayer === 1) {
                icon.classList.add('fa-solid', 'fa-x', 'yellow')
                turnIcon.classList.add('fa-solid', 'fa-0', 'turquoise')
                turnLabel.classList.add('turquoise')
            } else {
                icon.classList.add('fa-solid', 'fa-0', 'turquoise')
                turnIcon.classList.add('fa-solid', 'fa-x', 'yellow')
            };
            app.$.turn.replaceChildren(turnIcon, turnLabel)
            app.state.moves.push({
                squareId: +square.id,
                playerId: currentPlayer,            
            })
            console.log(app.state.moves)
            
            square.replaceChildren(icon)

            const game = app.getGameStatus(app.state.moves)
            console.log(game)
            if (game.status === 'complete') {
                app.$.modal.classList.remove("hidden")
                let message = ''
                if (game.winner) {
                    message = 'Player ' + game.winner + ' has won !'
                } else {
                    message = 'The game is tied !';
                }
                app.$.modalText.textContent = message;
                
            }
            })
        })
    }
}   
window.addEventListener("load", app.init);

function init() {
    const view = new View();
    console.log(view.$.turn)
}

window.addEventListener("load", init);
