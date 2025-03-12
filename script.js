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
let startX, startY;
let offsetX, offsetY;

const pieceSymbols = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

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
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.piece = board[row][col];

                // รองรับลากหมาก
                piece.addEventListener("dragstart", dragStart);
                piece.addEventListener("touchstart", touchStart);

                square.appendChild(piece);
            }

            square.addEventListener("dragover", dragOver);
            square.addEventListener("drop", drop);
            square.addEventListener("touchmove", touchMove);
            square.addEventListener("touchend", touchEnd);

            boardDiv.appendChild(square);
        }
    }
}

// **ฟังก์ชัน Drag & Drop บนคอม**
function dragStart(event) {
    selectedPiece = event.target;
    event.dataTransfer.setData("text", "");
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    movePiece(event.target.dataset.row, event.target.dataset.col);
}

// **ฟังก์ชัน Drag & Drop บนมือถือ**
function touchStart(event) {
    selectedPiece = event.target;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;

    offsetX = selectedPiece.getBoundingClientRect().width / 2;
    offsetY = selectedPiece.getBoundingClientRect().height / 2;

    event.preventDefault();
}

function touchMove(event) {
    if (!selectedPiece) return;

    let touch = event.touches[0];
    selectedPiece.style.position = "absolute";
    selectedPiece.style.left = touch.clientX - offsetX + "px";
    selectedPiece.style.top = touch.clientY - offsetY + "px";

    event.preventDefault();
}

function touchEnd(event) {
    let touch = event.changedTouches[0];
    let target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target && target.dataset.row !== undefined && target.dataset.col !== undefined) {
        movePiece(target.dataset.row, target.dataset.col);
    }

    selectedPiece.style.position = "static";
    selectedPiece = null;
}

// **ย้ายหมาก**
function movePiece(toRow, toCol) {
    if (!selectedPiece) return;

    let fromRow = parseInt(selectedPiece.dataset.row);
    let fromCol = parseInt(selectedPiece.dataset.col);
    toRow = parseInt(toRow);
    toCol = parseInt(toCol);

    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = "";
        drawBoard();
    }

    selectedPiece = null;
}

// **เช็คกฎหมากรุก**
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

drawBoard();
