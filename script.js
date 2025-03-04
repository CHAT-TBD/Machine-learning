let chatBox = document.getElementById("chat-box");
let userInput = document.getElementById("user-input");

// โหลดข้อมูล AI จาก memory.json
let memory = {};
fetch("memory.json")
    .then(response => response.json())
    .then(data => memory = data);

// ฟังก์ชันแสดงข้อความในกล่องแชท
function appendMessage(sender, message, isAI = false, question = "") {
    let messageDiv = document.createElement("div");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    
    if (isAI) {
        let goodButton = document.createElement("button");
        goodButton.innerText = "✅ Good";
        goodButton.onclick = () => rateResponse(question, message, true);
        
        let badButton = document.createElement("button");
        badButton.innerText = "❌ Bad";
        badButton.onclick = () => rateResponse(question, message, false);
        
        messageDiv.appendChild(goodButton);
        messageDiv.appendChild(badButton);
    }
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// **ฟังก์ชันวิเคราะห์คำถาม**
function findBestResponse(inputText) {
    let tokens = inputText.split(/\s+/);
    
    // ค้นหาคำถามที่มีอยู่ใน memory.json
    for (let key in memory) {
        let keyTokens = key.split(/\s+/);
        let matchCount = tokens.filter(t => keyTokens.includes(t)).length;
        let score = matchCount / keyTokens.length;
        
        if (score > 0.5) {
            return memory[key][Math.floor(Math.random() * memory[key].length)];
        }
    }

    return generateDynamicResponse(inputText);
}

// **ฟังก์ชันสร้างคำตอบ AI**
function generateDynamicResponse(inputText) {
    let tokens = inputText.split(/\s+/);
    
    if (tokens.includes("ชื่อ")) {
        return "ฉันคือ AI บอท!";
    } else if (tokens.includes("ทำอะไร")) {
        return "ฉันสามารถช่วยตอบคำถามของคุณได้!";
    } else {
        return "ฉันยังไม่รู้คำตอบ แต่คุณสามารถสอนฉันได้นะ!";
    }
}

// **ฟังก์ชันส่งข้อความ**
function sendMessage() {
    let text = userInput.value.trim();
    if (text === "") return;
    
    appendMessage("คุณ", text);
    userInput.value = "";

    // ให้ AI คิดคำตอบเอง
    let reply = findBestResponse(text);
    
    setTimeout(() => appendMessage("AI", reply, true, text), 500);
}

// **ฟังก์ชันให้คะแนน AI**
function rateResponse(question, answer, isGood) {
    if (isGood) {
        alert("ขอบคุณ! ฉันจะใช้คำตอบนี้ต่อไป");
    } else {
        let newAnswer = prompt("คำตอบที่ถูกต้องคืออะไร?");
        if (newAnswer) {
            if (!memory[question]) {
                memory[question] = [];
            }
            memory[question].push(newAnswer);
            alert("ฉันจะจำคำตอบนี้ไว้!");
        }
    }
}

// กด Enter เพื่อส่งข้อความ
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}
