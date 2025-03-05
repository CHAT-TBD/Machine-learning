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

    let loadingMessage = appendMessage("bot", "🤖 กำลังคิด...");
    let dots = 0;
    let loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4; 
        loadingMessage.innerText = "🤖 กำลังคิด" + ".".repeat(dots);
    }, 500);

    try {
        console.log("🚀 ส่งข้อความไปที่ OpenThaiGPT API:", userText);

        let response = await fetch("https://api.float16.cloud/dedicate/78y8fJLuzE/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer float16-9YQJTahVzkD1v7TAa15pdvDlernEkfjMjfOnoWlr1Cvu1hFYvp"
            },
            body: JSON.stringify({
                model: "openthaigpt/openthaigpt1.5-7b-instruct",
                prompt: userText,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        clearInterval(loadingInterval); // หยุดการหมุนจุด "..."
        
        if (!response.ok) {
            throw new Error(`❌ API ตอบกลับผิดพลาด: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();
        console.log("✅ API ตอบกลับ:", data);

        let botReply = data.choices?.[0]?.text?.trim() || "⚠️ ฉันไม่เข้าใจ กรุณาลองใหม่";
        loadingMessage.innerText = botReply;
    } catch (error) {
        clearInterval(loadingInterval); // หยุดการหมุนจุด "..." กรณี error
        console.error("❌ Error:", error);
        loadingMessage.innerText = "⚠️ ขออภัย ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง";
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
