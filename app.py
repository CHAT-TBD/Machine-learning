from flask import Flask, render_template, request, jsonify
import threading
import os
import pickle
import numpy as np

app = Flask(__name__)

training_status = {"status": "ready"}  # ready, training, done, error

# โหลดโมเดล
def load_model():
    global model
    try:
        with open("chatbot_model.pkl", "rb") as f:
            model = pickle.load(f)
        return True
    except:
        return False

def train_model():
    global training_status
    training_status["status"] = "training"
    
    try:
        os.system("python train_model.py")
        training_status["status"] = "done"
        load_model()  # โหลดโมเดลหลังเทรนเสร็จ
    except Exception as e:
        training_status["status"] = "error"
        print("Error:", e)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/train", methods=["POST"])
def start_training():
    if training_status["status"] == "ready":
        thread = threading.Thread(target=train_model)
        thread.start()
        return jsonify({"message": "Training started!"})
    else:
        return jsonify({"message": "Training already in progress!"})

@app.route("/status", methods=["GET"])
def check_status():
    return jsonify(training_status)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")

    if training_status["status"] != "done":
        return jsonify({"response": "โมเดลยังไม่ได้เทรน กรุณาเทรนก่อน!"})

    # จำลองการตอบโดยเลือกคำตอบสุ่ม
    response = "ฉันไม่เข้าใจสิ่งที่คุณพูด" if np.random.rand() > 0.5 else "ฉันกำลังเรียนรู้จากคุณ!"
    
    return jsonify({"response": response})

if __name__ == "__main__":
    if load_model():
        training_status["status"] = "done"
    app.run(debug=True)
