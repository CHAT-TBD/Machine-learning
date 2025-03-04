let lastIndex = null;

function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    let chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    chatBox.innerHTML += `<div><b>คุณ:</b> ${userInput}</div>`;

    fetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: userInput }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        lastIndex = data.index;
        chatBox.innerHTML += `<div><b>บอท:</b> ${data.response} 
            <button onclick="sendFeedback('good')">เยี่ยม</button>
            <button onclick="sendFeedback('bad')">แย่</button></div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    document.getElementById("user-input").value = "";
}

function sendFeedback(feedback) {
    if (lastIndex !== null) {
        fetch("/feedback", {
            method: "POST",
            body: JSON.stringify({ index: lastIndex, feedback: feedback }),
            headers: { "Content-Type": "application/json" }
        }).then(response => response.json())
          .then(data => alert(data.message));
    }
}
