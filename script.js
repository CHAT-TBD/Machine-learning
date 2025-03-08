let model;

async function loadModel() {
    model = await tf.loadLayersModel('chatbot_model/model.json');
    console.log("Model Loaded!");
}

async function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    // จำลองการแปลงข้อความเป็นตัวเลข (ต้องใช้ Tokenizer จริงๆ)
    let inputTensor = tf.tensor2d([Math.random() * 5000], [1, 10]);

    let prediction = model.predict(inputTensor);
    let responseIndex = prediction.argMax(1).dataSync()[0];

    let botResponse = `Bot: Response ${responseIndex}`;
    chatBox.innerHTML += `<p><strong>${botResponse}</strong></p>`;

    document.getElementById("user-input").value = "";
}

// โหลดโมเดลเมื่อเปิดหน้าเว็บ
loadModel();