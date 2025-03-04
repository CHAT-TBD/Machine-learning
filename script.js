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
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    appendMessage("user", userInput);
    document.getElementById("user-input").value = "";

    let loadingMessage = appendMessage("bot", "กำลังคิด...");

    try {
        console.log("🚀 ส่งข้อความไปที่ API:", userInput);
        let response = await fetch("https://api.ml-chatgpt.com/v1/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userInput })
        });

        if (!response.ok) throw new Error(`❌ API ตอบกลับผิดพลาด: ${response.status}`);

        let data = await response.json();
        console.log("✅ API ตอบกลับ:", data);

        loadingMessage.innerText = data.text || "ไม่มีข้อมูลตอบกลับ";
    } catch (error) {
        console.error("❌ Error:", error);
        loadingMessage.innerText = "ขออภัย มีข้อผิดพลาดในการเชื่อมต่อ API";
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
