function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    let chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    // แสดงข้อความของผู้ใช้
    chatBox.innerHTML += `<div><b>คุณ:</b> ${userInput}</div>`;

    // ส่งข้อมูลไปหา Flask Backend
    fetch("/ask", {
        method: "POST",
        body: JSON.stringify({ question: userInput }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        chatBox.innerHTML += `<div><b>Chatbot:</b> ${data.answer}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight; // เลื่อนลงอัตโนมัติ
    });

    document.getElementById("user-input").value = "";
}

function checkEnter(event) {
    if (event.key === "Enter") sendMessage();
}
