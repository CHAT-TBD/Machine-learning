var game = new Chess();
var stockfish = new Worker("stockfish.js");
var board = document.getElementById("chessboard");
var selectedSquare = null;

// อักขระหมากรุก
const pieceSymbols = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

// ฟังก์ชันสร้างกระดาน
function drawBoard() {
    board.innerHTML = "";
    let boardArray = game.board();
    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement("div");
            square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
            square.dataset.position = String.fromCharCode(97 + col) + (row + 1);

            let piece = boardArray[row][col];
            if (piece) {
                square.textContent = pieceSymbols[piece.type];
                square.dataset.piece = piece.color + piece.type;
            }

            square.addEventListener("click", handleMove);
            board.appendChild(square);
        }
    }
}

// ฟังก์ชันเลือกเดินหมาก
function handleMove(event) {
    let clickedSquare = event.target.dataset.position;

    if (!selectedSquare) {
        selectedSquare = clickedSquare;
        event.target.classList.add("selected");
    } else {
        let move = game.move({ from: selectedSquare, to: clickedSquare });
        if (move) {
            drawBoard();
            setTimeout(makeAIMove, 500);
        }
        selectedSquare = null;
    }
}

// ให้ AI คิดหมาก
function makeAIMove() {
    if (game.game_over()) {
        alert("เกมจบแล้ว!");
        return;
    }
    stockfish.postMessage("position fen " + game.fen());
    stockfish.postMessage("go depth 15");
}

// AI ตอบกลับและเดินหมาก
stockfish.onmessage = function(event) {
    let move = event.data.match(/bestmove\s(\S+)/);
    if (move) {
        game.move(move[1]);
        drawBoard();

        if (game.game_over()) {
            alert("เกมจบแล้ว!");
        }
    }
};

// เริ่มเกม
drawBoard();
