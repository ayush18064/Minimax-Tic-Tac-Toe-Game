let boxes = document.querySelectorAll(".box");
let headerText = document.querySelector(".header-text");
let resetbtn = document.querySelector("#reset-btn")
let ai_player = "X";
let human = "O";
let currentplayer = human;

const winningConditionPattern = [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

let board = [null, null, null, null, null, null, null, null, null];

boxes.forEach((val) => {
    val.addEventListener("click", (e) => {
        handleClick(e);
    });
});

function handleClick(e) {
    let id = Number(e.target.id);
    if (board[id] == null && currentplayer == human) {
        e.target.innerText = currentplayer;
        e.target.style.pointerEvents = "none";
        board[id] = currentplayer;
        if (!checkWinner() && !isBoardFull()) {
            currentplayer = ai_player;
            headerText.innerHTML = `<h1 class="whichplayer">${currentplayer}'s Turn</h1>`;
            setTimeout(() => {
                BestMove();
            }, 500);
        }
    }
}

function BestMove() {
    let bestScore = -Infinity;
    let move;
    board.forEach((val, index) => {
        if (val == null) {
            board[index] = ai_player;
            let score = MiniMax(board, 0, false);
            board[index] = null;
            if (score >= bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    if (move !== undefined) {
        board[move] = ai_player;
        boxes[move].innerText = ai_player;
        boxes[move].style.pointerEvents = "none";
        if (!checkWinner() && !isBoardFull()) {
            currentplayer = human;
            headerText.innerHTML = `<h1 class="whichplayer">${currentplayer}'s Turn</h1>`;
        }
    }
}

function checkWinner() {
    for (let pattern of winningConditionPattern) {
        let posVal1 = board[pattern[0]];
        let posVal2 = board[pattern[1]];
        let posVal3 = board[pattern[2]];
        if (posVal1 != null && posVal1 === posVal2 && posVal1 === posVal3) {
            headerText.innerText = `${posVal1} Won!`;
            // highlightWinningBoxes(pattern);
            gameOver = true;
            return posVal1;
        }
    }
    if (isBoardFull()) {
        headerText.innerText = "Draw!";
        return "draw";
    }
    return null;
}

function isBoardFull() {
    return board.every(cell => cell != null);
}

let scores = {
    "X": 1,
    "O": -1,
    "draw": 0,
};
let count = 0;
function MiniMax(board, depth, isMaximizingPlayer) { // board,0,false
    let result = checkWinner();
    // this simply means that the game has not ended
    if (result !== null) {
        return scores[result];
    }
   
    if (isMaximizingPlayer) { // this checks that if the player is minimizing or maximizing 
        let bestScore = -Infinity;
        board.forEach((val, index) => {
            if (val == null) {
                board[index] = ai_player;
                let score = MiniMax(board, depth + 1, false);
                board[index] = null;
                bestScore = Math.max(score, bestScore);
              
            }
        });
        console.log("minimizing on this array  ", board, bestScore,  count++)
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((val, index) => {
            if (val == null) {

                board[index] = human;
                let score = MiniMax(board, depth + 1, true);
                board[index] = null;
                bestScore = Math.min(score, bestScore);
            }
        });

        return bestScore;
    }
}

// function highlightWinningBoxes(pattern) {
//     pattern.forEach(index => {
//         boxes[index].classList.add("highlight");
//     });
// }
resetbtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.reload(true);
})

// Initialization to start the game
headerText.innerHTML = `<h1 class="whichplayer">${currentplayer}'s Turn</h1>`;
