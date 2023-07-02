const cells = document.querySelectorAll(".cell");
const xText = document.querySelector("#xText");
const circleText = document.querySelector("#circleText");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartButton");
const soloBtn = document.querySelector("#soloChange");

let xPoints = 0;
let circlePoints = 0;
let solo = true;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

soloBtn.textContent = "Solo"

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    soloBtn.addEventListener("click", changeMode);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function changeMode(){
    if (solo == true) {
        soloBtn.textContent = "Multiplayer"; solo = false;
    } else {
        soloBtn.textContent = "Solo"; solo = true;
    }
    restartGame();
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;

    if (currentPlayer == "O" && solo == true){
        robotTurn();
    }
}

function robotTurn(){
    const emptyCells = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i] === "") {
        emptyCells.push(i);
      }
    }

    // Randomly select an empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const selectedCell = emptyCells[randomIndex];

    // Simulate a delay before the robot makes its move
    setTimeout(() => {
        const cellElement = cells[selectedCell];
        updateCell(cellElement, selectedCell);
        checkWinner();
    }, 500);
}


function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        let audio = new Audio("./src/win Sound.mp3")
        audio.play();
        running = false;

        if (currentPlayer == "X"){
            xPoints = xPoints + 1;
            xText.textContent = `X: ${xPoints}`;

        } else if (currentPlayer == "O"){
            circlePoints = circlePoints + 1;
            circleText.textContent = `O: ${circlePoints}`;
        } 

    } else if (!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}