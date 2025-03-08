from flask import Flask, render_template, request, jsonify
import sqlite3
import pickle
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

# โหลดโมเดล
def load_model():
    global model, tokenizer
    try:
        with open("chatbot_model.pkl", "rb") as f:
            model, tokenizer = pickle.load(f)
        return True
    except:
        return False

# ค้นหาคำตอบโดยใช้โมเดล
def get_response(user_input):
    if not model:
        return "ฉันยังไม่ได้เรียนรู้มากพอ กรุณาฝึกฉันก่อน!"

    seq = tokenizer.texts_to_sequences([user_input])
    seq = pad_sequences(seq, maxlen=10)
    prediction = model.predict(seq)
    response_idx = np.argmax(prediction)
    
    return tokenizer.index_word.get(response_idx, "ฉันไม่เข้าใจคำถามของคุณ")

# บันทึกฟีดแบค
def save_feedback(question, answer, feedback):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chatbot_feedback (question, answer, feedback) VALUES (?, ?, ?)", (question, answer, feedback))
    conn.commit()
    conn.close()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")
    response = get_response(user_input)
    return jsonify({"response": response})

@app.route("/feedback", methods=["POST"])
def feedback():
    data = request.json
    save_feedback(data["question"], data["answer"], data["feedback"])
    return jsonify({"message": "บันทึกฟีดแบคเรียบร้อย!"})

if __name__ == "__main__":
    load_model()
    app.run(debug=True)
