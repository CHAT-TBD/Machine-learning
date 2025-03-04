from flask import Flask, render_template, request, jsonify
from chatbot_model import chatbot

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

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
