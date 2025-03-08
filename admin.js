const ADMIN_GIST_URL = `https://gist.githubusercontent.com/raw/${GIST_ID}/chatbot-data.json`;

let chatData = {};

// ตรวจสอบสิทธิ์แอดมิน
if (localStorage.getItem("isAdmin") !== "true") {
    alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
    window.location.href = "index.html";
}

// โหลดข้อมูลบอท
async function loadChatData() {
    try {
        let response = await fetch(ADMIN_GIST_URL);
        chatData = await response.json();
        renderTable();
    } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
    }
}

// แสดงข้อมูลในตาราง
function renderTable() {
    let tableBody = document.querySelector("#chat-data-table tbody");
    tableBody.innerHTML = "";

    for (let [question, data] of Object.entries(chatData)) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${question}</td>
            <td><input type="text" value="${data.answer}" data-question="${question}"></td>
            <td>${data.addedBy || "ไม่ทราบ"}</td>
            <td><button onclick="updateAnswer('${question}')">บันทึก</button></td>
        `;
        tableBody.appendChild(row);
    }
}

// อัปเดตคำตอบ
async function updateAnswer(question) {
    let input = document.querySelector(`input[data-question='${question}']`);
    chatData[question].answer = input.value;
    await updateGistData();
    alert("อัปเดตสำเร็จ!");
}

// ออกจากระบบ
function logout() {
    localStorage.removeItem("isAdmin");
    window.location.href = "index.html";
}

loadChatData();
