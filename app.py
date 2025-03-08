from flask import Flask, render_template, jsonify
import threading
import os

app = Flask(__name__)

training_status = {"status": "ready"}  # ready, training, done, error

def train_model():
    global training_status
    training_status["status"] = "training"
    
    try:
        os.system("python train_model.py")
        training_status["status"] = "done"
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

if __name__ == "__main__":
    app.run(debug=True)
