document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    appendMessage("user", userInput);
    document.getElementById("user-input").value = "";

    // แสดงข้อความกำลังโหลด
    let loadingMessage = appendMessage("bot", "กำลังคิด...");

    try {
        let response = await fetch("https://api.ml-chatgpt.com/v1/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userInput })
        });

        if (!response.ok) throw new Error("การตอบกลับของ API ไม่ถูกต้อง");

        let data = await response.json();
        loadingMessage.innerText = data.text || "ไม่มีข้อมูลตอบกลับ";
    } catch (error) {
        console.error("Error:", error);
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
    return messageDiv; // คืนค่า element เพื่อใช้แก้ไขข้อความทีหลัง
}
