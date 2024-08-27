document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.querySelector("dialog");
    dialog.showModal();

    // prevent esc from closing the dialog modal
    document.addEventListener('keydown', function(event) { 
        if (event.key === "Escape") {
            event.preventDefault();
        }
    }); 
});


function Game() {
    const board = (function () {
        let cells = Array(9).fill("");
        const reset = () => {
            cells = cells.fill("");
        };

        const getBoard = () => cells;

        const setCell = (cellIndex, symbol) => {
            if (cells[cellIndex] === "") {
                cells[cellIndex] = symbol;
                return true;
            }
            return false;
        };

        const isFull = () => cells.every(cell => cell !== "");

        return {
            reset,
            getBoard,
            setCell,
            isFull,
        };
    })();

    const player1 = {
        name: "player1",
        symbol: "X"
    };

    const player2 = {
        name: "player2",
        symbol: "O"
    };

    (function () {
        const form = document.querySelector("form");
        form.addEventListener("submit", () => {
            player1.name = form.elements["first-player"].value;
            player2.name = form.elements["second-player"].value;
        });
    })();

    let activePlayer = player1;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer === player1) ? player2 : player1;
    };

    const checkWinner = () => {
        const cells = board.getBoard();

        for (let i = 0; i < 9; i = i + 3) { // horizontal check
            if (cells[i] && cells[i] == cells[i + 1] && cells[i] == cells[i + 2]) {
                return activePlayer;
            }
        }

        for (let i = 0; i < 3; i++) { // vertical check
            if (cells[i] && cells[i] == cells[i + 3] && cells[i] == cells[i + 6]) {
                return activePlayer;
            }
        }

        if (cells[0] && cells[0] == cells[4] && cells[0] == cells[8]) { // diagonal check
            return activePlayer;
        }

        if (cells[2] && cells[2] == cells[4] && cells[2] == cells[6]) { // diagonal check
            return activePlayer;
        }
        return null;
    };

    const playRound = (index) => {
        if (board.setCell(index, activePlayer.symbol)) {
            const winner = checkWinner();
            render();
            if (board.isFull() && winner === null) {
                finishGame(null);
            }
            else if (winner) {
                finishGame(winner);
            }
            else {
                switchActivePlayer();
            }
        }
    };

    const finishGame = (winner) => {
        const output = document.querySelector(".winner");
        const container = document.querySelector(".container");
        if (winner === null) {
            output.textContent = "It's a tie!";
        }
        else {
            output.textContent = winner.name + " won!";
        }
        container.style.pointerEvents = "none"; // Disable further moves
        document.querySelector(".play-again").style.display = "block"; // Show Play Again button
    }

    const resetGame = () => {
        board.reset();
        activePlayer = player1;
        document.querySelector(".container").style.pointerEvents = "auto"; // Re-enable moves
        document.querySelector(".play-again").style.display = "none"; // Hide Play Again button
        render();
    };

    const render = () => {
        const cells = board.getBoard();
        document.querySelectorAll(".cell").forEach((cell, index) => {
            cell.textContent = cells[index];
        });
    };

    (function () {
        const cellsContainer = document.querySelector(".container");
        cellsContainer.addEventListener("click", e => {
            if (e.target.className === "cell" && e.target.textContent === "") {
                playRound(e.target.dataset.index);
            }
        });

        // Add event listener for Play Again button
        document.querySelector(".play-again button").addEventListener("click", resetGame);
    })();

    return board;
}

const game = Game();
