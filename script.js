'use strict';


// Name array
const nameArray = [];

// Adding query selectors
const player1Input = document.querySelector('input[name="player1"]');
const player2Input = document.querySelector('input[name="player2"]');
const displayName = document.querySelectorAll('.playerName');
const submit = document.getElementById('submit');
const form = document.getElementById('form1');
const buttons = document.querySelectorAll('.button'); // Select all cell buttons
const resetButton = document.querySelector('.reset'); // Reset button
const homeButton = document.querySelector('.home');

// Submit button event listener
submit.addEventListener('click', (e) =>{
    e.preventDefault();
    // Get player names from input fields
    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();

    // Validate inputs
    if (player1Name && player2Name) {
        nameArray[0] = player1Name;
        nameArray[1] = player2Name;
        displayName[0].textContent = nameArray[0];
        displayName[1].textContent = nameArray[1];
        console.log('Player names saved:', nameArray);
    } else {
        alert('Both player names are required.');
    }
    form.reset();
});

// GameBoard Module (IIFE) – Creates and returns a shared 3x3 grid
const GameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const grid = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => '')
    );

    return {
        getGrid: function () {
            return grid;
        },
        resetGrid: function () {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    grid[i][j] = '';
                }
            }
        }
    };
})();

// Function to check winner
function checkWinner(grid) {
    // Rows
    for (let row of grid) {
        if (row.every(cell => cell === 'X')) return 'X';
        if (row.every(cell => cell === 'O')) return 'O';
    }

    // Columns
    for (let col = 0; col < 3; col++) {
        if (grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]) {
            if (grid[0][col] === 'X') return 'X';
            if (grid[0][col] === 'O') return 'O';
        }
    }

    // Diagonals
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
        if (grid[0][0] === 'X') return 'X';
        if (grid[0][0] === 'O') return 'O';
    }

    if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
        if (grid[0][2] === 'X') return 'X';
        if (grid[0][2] === 'O') return 'O';
    }

    return null;
}

// Game Controller Module – handles switching players and calling `players`
const GameController = (function () {
    let currentPlayer = 0; // 0 for X, 1 for O
    const grid = GameBoard.getGrid(); // Access the shared grid

    return {
        winner: () => {
            const winner = checkWinner(grid);
            if(winner){
                buttons.forEach(btn => btn.disabled = true); // Disable all buttons
                if(winner === 'X'){
                    alert(`${nameArray[0]} won the game`);
                }
                else{
                    alert(`${nameArray[1]} won the game`);
                }
                return 1;
            }
            return null;
        },
        play: function (row, column, button) {
            // Out of bounds check
            if (row < 0 || row >= grid.length || column < 0 || column >= grid[0].length) {
                console.log('Out of bounds');
                return;
            }

            // Cell already marked
            if (grid[row][column] === 'X' || grid[row][column] === 'O') {
                console.log('The cell is already marked.');
                return;
            }

            // Place mark
            grid[row][column] = currentPlayer === 0 ? 'X' : 'O';
            button.textContent = grid[row][column]; // Update button text
            // Switch player
            currentPlayer = currentPlayer === 0 ? 1 : 0;
            this.winner();
        },
        reset: function () {
            // Reset the grid and buttons
            GameBoard.resetGrid(); // Reset the shared grid
            buttons.forEach(btn => {
                btn.textContent = '';
                btn.disabled = false;
            });
            currentPlayer = 0;
            console.log('Game reset!');
        },
        currentPlayer: () =>{
            return currentPlayer;
        }
    };
})();

// Add event listeners to buttons
buttons.forEach((button, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    

        button.addEventListener('click', () => {
        // Play the Game only if the Credentials are filled
        if(displayName[0].textContent===nameArray[0]){    
            if(!GameController.winner())
                GameController.play(row, column, button);
        }
        else
            alert('Both Player Names Are Required Before Playing The Game');
    });
        
});

// Add event listener to reset button
resetButton.addEventListener('click', () => {
    GameController.reset();
});
// Event listener to home button
homeButton.addEventListener('click', ()=>{
    displayName[0].textContent = 'Player 1'
    displayName[1].textContent = 'Player 2'
    GameController.reset();
    console.log('Home Button pressed');
});
