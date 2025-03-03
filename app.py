from flask import Flask, render_template, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

app = Flask(__name__)

# โหลดโมเดล mT5
model_name = "google/mt5-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# ฟังก์ชันให้ AI สร้างคำตอบ
def chatbot_response(question):
    prompt = f"ตอบคำถามต่อไปนี้อย่างถูกต้อง: {question}"
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)

    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=50, num_return_sequences=1)

    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return answer

# Route สำหรับแสดงหน้าเว็บ
@app.route("/")
def home():
    return render_template("index.html")

# Route สำหรับรับคำถามจาก JavaScript
@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("question")
    response = chatbot_response(user_input)
    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(debug=True)
