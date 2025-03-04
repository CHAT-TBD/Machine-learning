let chatBox = document.getElementById("chat-box");
let userInput = document.getElementById("user-input");

// ฟังก์ชันแสดงข้อความในกล่องแชท
function appendMessage(sender, message) {
    let messageDiv = document.createElement("div");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// **คำศัพท์ที่ AI คิดเอง**
const nouns = ["แมว", "สุนัข", "นก", "เด็ก", "หุ่นยนต์", "ต้นไม้", "ภูเขา"];
const verbs = ["กิน", "วิ่ง", "กระโดด", "นอน", "พูด", "เรียน", "สร้าง"];
const adjectives = ["เร็ว", "น่ารัก", "ฉลาด", "แปลก", "ตลก", "แข็งแกร่ง"];
const objects = ["ข้าว", "หนังสือ", "เกม", "ปากกา", "มือถือ", "โลก"];

// **ฟังก์ชันสุ่มคำและสร้างประโยค**
function generateSentence() {
    let subject = nouns[Math.floor(Math.random() * nouns.length)];
    let verb = verbs[Math.floor(Math.random() * verbs.length)];
    let object = objects[Math.floor(Math.random() * objects.length)];
    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    let sentenceType = Math.random();
    
    if (sentenceType < 0.5) {
        return `${subject} ${verb} ${object} อย่าง${adjective}`;
    } else {
        return `วันนี้ ${subject} ดู${adjective} มากเลย!`;
    }
}

// **ฟังก์ชันส่งข้อความ**
function sendMessage() {
    let text = userInput.value.trim();
    if (text === "") return;
    
    appendMessage("คุณ", text);
    userInput.value = "";

    // ให้ AI คิดประโยคใหม่เอง
    let reply = generateSentence();
    
    setTimeout(() => appendMessage("AI", reply), 500);
}

// กด Enter เพื่อส่งข้อความ
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}
