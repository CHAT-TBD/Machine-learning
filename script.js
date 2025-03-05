console.log("✅ Script Loaded: JavaScript ทำงานแล้ว");

document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");

    if (!sendBtn || !userInput) {
        console.error("❌ ไม่พบปุ่มหรือช่องป้อนข้อความ ตรวจสอบ HTML อีกครั้ง");
        return;
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    console.log("✅ Event Listeners ถูกตั้งค่าเรียบร้อย");
});

async function sendMessage() {
    let userText = document.getElementById("user-input").value.trim();
    if (userText === "") return;

    appendMessage("user", userText);
    document.getElementById("user-input").value = "";

    let loadingMessage = appendMessage("bot", "🤖 กำลังคิด");
    let dots = 0;
    let loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4; 
        loadingMessage.innerText = "🤖 กำลังคิด" + ".".repeat(dots);
    }, 500);

    try {
        console.log("🚀 ส่งข้อความไปที่ OpenAI API:", userText);

        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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" // ใส่ API Key ตรงนี้
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userText }]
            })
        });

        clearInterval(loadingInterval); // หยุดการหมุนจุด "..."
        
        if (!response.ok) {
            throw new Error(`❌ API ตอบกลับผิดพลาด: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();
        console.log("✅ API ตอบกลับ:", data);

        let botReply = data.choices[0].message.content || "⚠️ ฉันไม่เข้าใจ กรุณาลองใหม่";

        loadingMessage.innerText = botReply;
    } catch (error) {
        clearInterval(loadingInterval); // หยุดการหมุนจุด "..." กรณี error
        console.error("❌ Error:", error);
        loadingMessage.innerText = "⚠️ ขออภัย มีข้อผิดพลาดในการเชื่อมต่อ API";
    }
}

function appendMessage(sender, text) {
    let chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}
