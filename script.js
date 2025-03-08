let chatBox = document.getElementById("chat-box");
let userInput = document.getElementById("user-input");

// โหลดข้อมูลคำถาม-คำตอบจาก localStorage
let chatData = JSON.parse(localStorage.getItem("chatData")) || {};

// โหลดข้อมูลเริ่มต้นจาก JSON (ครั้งแรก)
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        chatData = { ...data, ...chatData };
        localStorage.setItem("chatData", JSON.stringify(chatData));
    });

// ฟังก์ชันคำนวณ Levenshtein Distance
function levenshtein(a, b) {
    let tmp;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    if (a.length > b.length) tmp = a, a = b, b = tmp;

    let row = Array(a.length + 1).fill(0);
    for (let i = 0; i <= a.length; i++) row[i] = i;

    for (let i = 1; i <= b.length; i++) {
        let prev = i;
        for (let j = 1; j <= a.length; j++) {
            let val = row[j - 1];
            if (b[i - 1] !== a[j - 1]) val = Math.min(prev, row[j], row[j - 1]) + 1;
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }
    return row[a.length];
}

// ค้นหาคำถามที่ใกล้เคียงที่สุด
function findClosestQuestion(userText) {
    let minDistance = Infinity;
    let bestMatch = null;

    for (let question in chatData) {
        let distance = levenshtein(userText, question);
        if (distance < minDistance && distance <= 2) {  // อนุญาตให้ผิดได้ไม่เกิน 2 ตัวอักษร
            minDistance = distance;
            bestMatch = question;
        }
    }

    return bestMatch;
}

// ฟังก์ชันส่งข้อความ
function sendMessage() {
    let text = userInput.value.trim();
    if (!text) return;

    // แสดงข้อความของผู้ใช้
    appendMessage("คุณ", text);

    // ค้นหาคำถามที่ใกล้เคียง
    let matchedQuestion = findClosestQuestion(text);
    let response = matchedQuestion ? chatData[matchedQuestion] : "ฉันยังไม่รู้คำตอบ กรุณาสอนฉันด้วย!";
    
    let botMessage = appendMessage("บอท", response);

    // ถ้าบอทยังไม่รู้ ให้เพิ่มปุ่มสอนบอท
    if (!matchedQuestion) {
        addFeedbackButtons(botMessage, text);
    }

    userInput.value = "";
}

// ฟังก์ชันแสดงข้อความในแชท
function appendMessage(sender, message) {
    let msgElement = document.createElement("div");
    msgElement.classList.add("message");
    msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgElement;
}

// เพิ่มปุ่มให้ผู้ใช้สอนบอท
function addFeedbackButtons(element, userQuestion) {
    let feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback");

    let correctButton = document.createElement("button");
    correctButton.textContent = "เยี่ยม";
    correctButton.onclick = () => correctResponse(userQuestion, element.innerText);

    let incorrectButton = document.createElement("button");
    incorrectButton.textContent = "แย่";
    incorrectButton.onclick = () => incorrectResponse(userQuestion);

    feedbackDiv.appendChild(correctButton);
    feedbackDiv.appendChild(incorrectButton);
    element.appendChild(feedbackDiv);
}

// เมื่อผู้ใช้บอกว่าคำตอบถูกต้อง
function correctResponse(question, answer) {
    chatData[question] = answer;
    localStorage.setItem("chatData", JSON.stringify(chatData));
    alert("บอทจะจดจำคำตอบนี้แล้ว!");
}

// เมื่อผู้ใช้บอกว่าคำตอบผิด
function incorrectResponse(question) {
    let newAnswer = prompt("โปรดป้อนคำตอบที่ถูกต้องสำหรับ: " + question);
    if (newAnswer) {
        chatData[question] = newAnswer;
        localStorage.setItem("chatData", JSON.stringify(chatData));
        alert("ขอบคุณ! บอทเรียนรู้แล้ว");
    }
}
