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
let startX, startY;

const pieceSymbols = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

// ฟังก์ชันสร้างกระดาน
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

                // รองรับการลากบนคอมพิวเตอร์
                piece.addEventListener("dragstart", dragStart);
                
                // รองรับการลากบนมือถือ
                piece.addEventListener("touchstart", touchStart);

                square.appendChild(piece);
            }

            // รองรับ Drag & Drop บนคอมพิวเตอร์
            square.addEventListener("dragover", dragOver);
            square.addEventListener("drop", drop);

            // รองรับ Drag & Drop บนมือถือ
            square.addEventListener("touchmove", touchMove);
            square.addEventListener("touchend", touchEnd);

            boardDiv.appendChild(square);
        }
    }
}

// **ฟังก์ชัน Drag & Drop บนคอม**
function dragStart(event) {
    selectedPiece = event.target;
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
}

function touchMove(event) {
    event.preventDefault();
}

function touchEnd(event) {
    let endX = event.changedTouches[0].clientX;
    let endY = event.changedTouches[0].clientY;
    let target = document.elementFromPoint(endX, endY);

    if (target && target.dataset.row && target.dataset.col) {
        movePiece(target.dataset.row, target.dataset.col);
    }
}

// **ตรวจสอบการเดินหมาก**
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
        setTimeout(aiMove, 500);
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

// **AI ใช้ Minimax (พื้นฐาน)**
function aiMove() {
    let moveMade = false;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] && board[row][col] === board[row][col].toLowerCase()) {
                let toRow = row + 1;
                if (toRow < 8 && board[toRow][col] === "") {
                    board[toRow][col] = board[row][col];
                    board[row][col] = "";
                    moveMade = true;
                    break;
                }
            }
        }
        if (moveMade) break;
    }
    drawBoard();
}

drawBoard();
