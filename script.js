// Gameboard
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const setCell = (index, marker) => {
        if (board[index] === "") 
        {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const getBoard = () => board;
    const reset = () => board = ["", "", "", "", "", "", "", "", ""];

    return { setCell, getBoard, reset };
})();


// Player 
const Player = (name, marker) => {
    return { name, marker };
};


// Game Controller
const GameController = (() => {
    let playerOne;
    let playerTwo;
    let currentPlayer;
    let gameOver = false;

    const switchTurn = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    };

    const playTurn = (index) => {
        if (gameOver) 
        {
            return "Game over! Reset to play again.";
        }

        if (Gameboard.setCell(index, currentPlayer.marker)) 
        {
            if (checkWin()) 
            {
                gameOver = true;
                return `${currentPlayer.name} wins!`;
            } 
            else if (checkDraw()) 
            {
                gameOver = true;
                return "It's a draw!";
            } 
            else 
            {
                switchTurn();
                return `${currentPlayer.name}'s turn`; 
            }
        } 
        else 
        {
            return "Cell already occupied! Choose another cell.";
        }
    };

    const startGame = (name1, name2) => {
        playerOne = Player(name1, "X");
        playerTwo = Player(name2, "O");
        currentPlayer = playerOne;
        gameOver = false;
        Gameboard.reset();
        displayController.render();
        document.getElementById('resultDisplay').textContent = ''; 
    };

    const resetGame = () => {
        Gameboard.reset();
        currentPlayer = playerOne;
        gameOver = false;
        displayController.render();
        document.getElementById('resultDisplay').textContent = ''; 
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]             
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    const checkDraw = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    return { playTurn, startGame, resetGame, checkWin, checkDraw, getCurrentPlayer: () => currentPlayer };
})();

const displayController = (() => {
    const gameboardElement = document.getElementById('gameboard'); 
    const resultDisplay = document.getElementById('resultDisplay'); 

    const render = () => {
        const board = Gameboard.getBoard();
        gameboardElement.innerHTML = ""; 

        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell'); 
            cellElement.dataset.index = index; 

            cellElement.textContent = cell;

            cellElement.addEventListener('click', () => {
                handleCellClick(index);
            });

            gameboardElement.appendChild(cellElement); 
        });
    };

    const handleCellClick = (index) => {
        const message = GameController.playTurn(index); 
        render(); 
    
        if (GameController.checkWin()) 
        {
            const winnerMessage = `${GameController.getCurrentPlayer().name} wins!`;
            resultDisplay.textContent = winnerMessage; 
            alert(winnerMessage);
        } 
        else if (GameController.checkDraw()) 
        {
            const drawMessage = "It's a draw!";
            resultDisplay.textContent = drawMessage; 
            alert(drawMessage); 
        } 
        else
        {
            if (message !== `${GameController.getCurrentPlayer().name}'s turn`) 
            {
                alert(message); 
            } 
            else
            {
                resultDisplay.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
            }
        }
    };
    
    return { render };
})();

// Event Listeners
document.getElementById('startButton').addEventListener('click', () => {
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;

    if (player1Name && player2Name) 
    {
        GameController.startGame(player1Name, player2Name);
    } 
    else
    {
        alert("Please enter names for both players.");
    }
});

displayController.render(); 
