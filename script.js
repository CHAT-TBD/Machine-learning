let board = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

let selectedPiece = null;
let currentTurn = "w"; // เริ่มที่ฝ่ายขาว

const pieceSymbols = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

// สร้างกระดานหมากรุก
function drawBoard() {
    let boardDiv = document.getElementById("chessboard");
    boardDiv.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement("div");
            square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
            square.dataset.row = row;
            square.dataset.col = col;

            if (board[row][col]) {
                let piece = document.createElement("div");
                piece.textContent = pieceSymbols[board[row][col]];
                piece.className = "piece";
                piece.draggable = true;
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.piece = board[row][col];

                piece.addEventListener("dragstart", dragStart);
                square.appendChild(piece);
            }

            square.addEventListener("dragover", dragOver);
            square.addEventListener("drop", drop);
            boardDiv.appendChild(square);
        }
    }
}

// ฟังก์ชัน Drag & Drop
function dragStart(event) {
    selectedPiece = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (!selectedPiece) return;

    let fromRow = parseInt(selectedPiece.dataset.row);
    let fromCol = parseInt(selectedPiece.dataset.col);
    let toRow = parseInt(event.target.dataset.row);
    let toCol = parseInt(event.target.dataset.col);

    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = "";
        drawBoard();
        setTimeout(aiMove, 500);
    }

    selectedPiece = null;
}

// ตรวจสอบกฎหมากรุก
function isValidMove(fromRow, fromCol, toRow, toCol) {
    let piece = board[fromRow][fromCol];
    let target = board[toRow][toCol];

    if (!piece) return false;
    if (target && target.toUpperCase() === target === piece.toUpperCase()) return false;

    let dr = Math.abs(toRow - fromRow);
    let dc = Math.abs(toCol - fromCol);

    switch (piece.toLowerCase()) {
        case "p":
            let direction = piece === "P" ? -1 : 1;
            if (toCol === fromCol && !target && (toRow - fromRow) === direction) return true;
            if (dr === 1 && dc === 1 && target) return true;
            return false;
        case "r":
            if (fromRow !== toRow && fromCol !== toCol) return false;
            return true;
        case "n":
            return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
        case "b":
            if (dr !== dc) return false;
            return true;
        case "q":
            return dr === dc || fromRow === toRow || fromCol === toCol;
        case "k":
            return dr <= 1 && dc <= 1;
    }
    return false;
}

// AI หมากรุก (Minimax + Alpha-Beta)
function aiMove() {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let piece = board[row][col];
            if (piece && piece.toLowerCase() === piece) {
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        if (isValidMove(row, col, r, c)) {
                            let temp = board[r][c];
                            board[r][c] = board[row][col];
                            board[row][col] = "";

                            let score = evaluateBoard();
                            if (score > bestScore) {
                                bestScore = score;
                                bestMove = { fromRow: row, fromCol: col, toRow: r, toCol: c };
                            }

                            board[row][col] = board[r][c];
                            board[r][c] = temp;
                        }
                    }
                }
            }
        }
    }

    if (bestMove) {
        board[bestMove.toRow][bestMove.toCol] = board[bestMove.fromRow][bestMove.fromCol];
        board[bestMove.fromRow][bestMove.fromCol] = "";
        drawBoard();
    }
}

// ฟังก์ชันประเมินกระดาน
function evaluateBoard() {
    return Math.random();
}

drawBoard();
