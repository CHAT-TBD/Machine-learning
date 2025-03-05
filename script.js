document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    function appendMessage(sender, text) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageDiv.innerText = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageDiv;
    }

    async function sendMessage() {
        let userText = userInput.value.trim();
        if (userText === "") return;

        appendMessage("user", userText);
        userInput.value = "";

        let loadingMessage = appendMessage("bot", "กำลังคิด...");

        try {
            let response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyDF7fFIDnZw4dEQmXq_G9WRDjqLwxv0Vxw", {  // ใส่ API จริงที่นี่
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) throw new Error(`❌ API ผิดพลาด: ${response.status}`);

            let data = await response.json();
            let botReply = data.reply || "⚠️ ฉันไม่เข้าใจ กรุณาลองใหม่";

            loadingMessage.innerText = botReply;
        } catch (error) {
            loadingMessage.innerText = "⚠️ ข้อผิดพลาดในการเชื่อมต่อ API";
        }
    }
});
