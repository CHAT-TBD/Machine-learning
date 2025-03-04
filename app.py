from flask import Flask, request, jsonify

from chatbot_model import chatbot  # ใช้โมเดล TF-IDF ตามที่สร้างไว้

app = Flask(__name__)

# HTML + CSS + JS ฝังอยู่ใน Flask
HTML_PAGE = """
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thai Chatbot</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; background: #f4f4f4; }
        .chat-container { width: 400px; margin: auto; background: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
        #chat-box { height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
        input { width: 80%; padding: 5px; }
        button { margin-top: 5px; padding: 5px; }
    </style>
</head>
<body>
    <div class="chat-container">
        <h2>Thai Chatbot</h2>
        <div id="chat-box"></div>
        <input type="text" id="user-input" placeholder="พิมพ์ข้อความ..." />
        <button onclick="sendMessage()">ส่ง</button>
    </div>
    <script>
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
    </script>
</body>
</html>
"""

@app.route("/")
def index():
    return HTML_PAGE

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    bot_response, index = chatbot.get_response(user_message)
    return jsonify({"response": bot_response, "index": index})

@app.route("/feedback", methods=["POST"])
def feedback():
    data = request.json
    chatbot.update_score(data["index"], data["feedback"])
    return jsonify({"message": "ขอบคุณสำหรับความคิดเห็น!"})

if __name__ == "__main__":
    app.run(debug=True)
