function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    if (userInput.trim() === "") return;

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("chatResponse").innerText = "บอท: " + data.response;
        document.getElementById("feedback").style.display = "block";
    });
}

function sendFeedback(feedback) {
    let userInput = document.getElementById("userInput").value;
    let botResponse = document.getElementById("chatResponse").innerText.replace("บอท: ", "");

    fetch("/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput, answer: botResponse, feedback: feedback })
    })
    .then(response => response.json())
    .then(data => {
        alert("บันทึกฟีดแบค: " + feedback);
    });
}
