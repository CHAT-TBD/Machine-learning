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

    try {
        console.log("🚀 ส่งข้อความไปที่ Wit.ai API:", userText);

        let response = await fetch(`https://api.wit.ai/message?v=20230215&q=${encodeURIComponent(userText)}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer GQXGMJZJPM7NBK6GJTOCIFEPVEVKYWBN"
            }
        });

        if (!response.ok) {
            throw new Error(`❌ API ตอบกลับผิดพลาด: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();
        console.log("✅ API ตอบกลับ:", data);

        let botReply = data?.entities?.intent?.[0]?.value || "⚠️ ไม่สามารถเข้าใจข้อความของคุณได้";
        loadingMessage.innerText = botReply;
    } catch (error) {
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
