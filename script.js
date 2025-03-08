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

// ฟังก์ชันส่งข้อความ
function sendMessage() {
    let text = userInput.value.trim();
    if (!text) return;

    // แสดงข้อความของผู้ใช้
    appendMessage("คุณ", text);

    // ตรวจสอบว่ามีคำตอบหรือไม่
    let response = chatData[text] || "ฉันยังไม่รู้คำตอบ กรุณาสอนฉันด้วย!";
    let botMessage = appendMessage("บอท", response);

    // ถ้าบอทไม่รู้ ให้เพิ่มปุ่มเรียนรู้
    if (!chatData[text]) {
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
