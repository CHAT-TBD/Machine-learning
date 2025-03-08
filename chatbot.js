let db;

// เปิดฐานข้อมูล IndexedDB
const request = indexedDB.open("ChatbotDB", 1);

request.onupgradeneeded = function(event) {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("responses")) {
        db.createObjectStore("responses", { keyPath: "question" });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
};

function sendMessage() {
    let userInput = document.getElementById("userInput").value.trim();
    if (userInput === "") return;

    let transaction = db.transaction(["responses"], "readonly");
    let store = transaction.objectStore("responses");
    let request = store.get(userInput);

    request.onsuccess = function(event) {
        let data = event.target.result;
        if (data) {
            document.getElementById("chatResponse").innerText = "บอท: " + data.answer;
            document.getElementById("feedback").style.display = "block";
        } else {
            document.getElementById("chatResponse").innerText = "ฉันยังไม่รู้ กรุณาสอนฉัน!";
            document.getElementById("teachBot").style.display = "block";
        }
    };
}

function sendFeedback(feedback) {
    let userInput = document.getElementById("userInput").value.trim();
    let botResponse = document.getElementById("chatResponse").innerText.replace("บอท: ", "");

    if (feedback === "good") {
        alert("ขอบคุณสำหรับฟีดแบค!");
    } else {
        document.getElementById("teachBot").style.display = "block";
    }
}

function teachBot() {
    let question = document.getElementById("userInput").value.trim();
    let answer = document.getElementById("newAnswer").value.trim();
    if (answer === "") return;

    let transaction = db.transaction(["responses"], "readwrite");
    let store = transaction.objectStore("responses");
    store.put({ question: question, answer: answer });

    alert("บันทึกสำเร็จ! บอทจดจำคำตอบแล้ว");
    document.getElementById("teachBot").style.display = "none";
}
