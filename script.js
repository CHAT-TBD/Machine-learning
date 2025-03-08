const GIST_ID = "ff808b6318c68d96737b7f90ac7036e0";
const GIST_URL = `https://gist.githubusercontent.com/raw/${GIST_ID}/chatbot-data.json`;
const GITHUB_TOKEN = "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";
const GIST_UPDATE_URL = `https://api.github.com/gists/${GIST_ID}`;

let chatData = {};
let deviceID = localStorage.getItem("deviceID") || generateDeviceID();

// สร้าง ID เครื่องถ้ายังไม่มี
function generateDeviceID() {
    let id = "device-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("deviceID", id);
    return id;
}

// โหลดข้อมูลจาก GitHub Gist
async function loadChatData() {
    try {
        let response = await fetch(GIST_URL);
        chatData = await response.json();
        console.log("โหลดข้อมูลสำเร็จ:", chatData);
    } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
        chatData = {};
    }
}

// ส่งข้อความ
async function sendMessage() {
    let text = document.getElementById("user-input").value.trim();
    if (!text) return;

    appendMessage("คุณ", text);
    let response = findClosestMatch(text) || "ฉันยังไม่รู้คำตอบ กรุณาสอนฉันด้วย!";
    
    if (!chatData[text]) {
        addFeedbackButtons(text);
    }

    appendMessage("บอท", response);
    document.getElementById("user-input").value = "";
}

// ค้นหาคำถามที่ใกล้เคียง
function findClosestMatch(input) {
    let minDistance = 3; // ค่าความคลาดเคลื่อนที่ยอมรับได้
    let bestMatch = null;
    
    for (let question in chatData) {
        let distance = levenshteinDistance(input, question);
        if (distance <= minDistance) {
            bestMatch = question;
            minDistance = distance;
        }
    }

    return bestMatch ? chatData[bestMatch].answer : null;
}

// คำนวณระยะห่างอักขระ
function levenshteinDistance(a, b) {
    let tmp;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    if (a.length > b.length) tmp = a, a = b, b = tmp;

    let row = Array(a.length + 1).fill(0).map((_, i) => i);
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

// เพิ่มปุ่มให้ผู้ใช้ช่วยสอนบอท
function addFeedbackButtons(question) {
    let feedbackDiv = document.createElement("div");
    
    let correctButton = document.createElement("button");
    correctButton.textContent = "เยี่ยม";
    correctButton.onclick = () => correctResponse(question);

    let incorrectButton = document.createElement("button");
    incorrectButton.textContent = "แย่";
    incorrectButton.onclick = () => incorrectResponse(question);

    feedbackDiv.appendChild(correctButton);
    feedbackDiv.appendChild(incorrectButton);
    document.getElementById("chat-box").appendChild(feedbackDiv);
}

// สอนบอท
async function correctResponse(question) {
    let newAnswer = prompt(`ป้อนคำตอบสำหรับ "${question}"`);
    if (newAnswer) {
        chatData[question] = { answer: newAnswer, addedBy: deviceID };
        await updateGistData();
        alert("บอทเรียนรู้คำตอบแล้ว!");
    }
}

// อัปเดตข้อมูลลง Gist
async function updateGistData() {
    let updatedData = {
        "files": {
            "chatbot-data.json": {
                "content": JSON.stringify(chatData, null, 2)
            }
        }
    };

    let response = await fetch(GIST_UPDATE_URL, {
        method: "PATCH",
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    });

    if (response.ok) {
        console.log("ข้อมูลถูกบันทึกลง Gist แล้ว!");
    } else {
        console.error("อัปเดต Gist ไม่สำเร็จ:", await response.json());
    }
}

// แสดงข้อความในกล่องแชท
function appendMessage(sender, message) {
    let chatBox = document.getElementById("chat-box");
    let msgDiv = document.createElement("div");
    msgDiv.classList.add(sender === "คุณ" ? "user-msg" : "bot-msg");
    msgDiv.textContent = `${sender}: ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ไปที่หน้าหลังบ้าน
function openAdminPanel() {
    let password = prompt("กรอกรหัสผ่านเจ้าของ:");
    if (password === "admin123") {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "admin.html";
    } else {
        alert("รหัสผ่านผิด!");
    }
}

loadChatData();
