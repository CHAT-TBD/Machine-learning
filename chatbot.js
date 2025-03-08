function startTraining() {
    fetch("/train", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            document.getElementById("status").innerText = "สถานะ: กำลังเทรน...";
            checkStatus();
        });
}

function checkStatus() {
    fetch("/status")
        .then(response => response.json())
        .then(data => {
            let statusText = document.getElementById("status");

            if (data.status === "training") {
                statusText.innerText = "สถานะ: กำลังเทรน...";
                setTimeout(checkStatus, 2000);
            } else if (data.status === "done") {
                statusText.innerText = "สถานะ: เทรนเสร็จแล้ว!";
            } else if (data.status === "error") {
                statusText.innerText = "สถานะ: เกิดข้อผิดพลาด!";
            } else {
                statusText.innerText = "สถานะ: รอเริ่มเทรน";
            }
        });
}

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
    });
}
