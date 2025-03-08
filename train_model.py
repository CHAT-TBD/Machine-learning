import tensorflow as tf
import numpy as np
import tensorflowjs as tfjs
import pickle
import time

VOCAB_SIZE = 1000
MAX_LEN = 10

# สร้างโมเดล LSTM
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=VOCAB_SIZE, output_dim=32, input_length=MAX_LEN),
    tf.keras.layers.LSTM(64, return_sequences=True),
    tf.keras.layers.LSTM(64),
    tf.keras.layers.Dense(VOCAB_SIZE, activation="softmax")
])

model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

# เทรนโมเดล (จำลองว่าใช้เวลานาน)
for epoch in range(1, 6):
    time.sleep(2)
    print(f"Epoch {epoch}/5 กำลังเทรน...")

# บันทึกโมเดลสำหรับ TensorFlow.js
tfjs.converters.save_keras_model(model, "chatbot_model")

# บันทึกโมเดลเป็นไฟล์ pickle เพื่อใช้ใน Flask
with open("chatbot_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("โมเดลถูกบันทึกแล้วที่ chatbot_model/")
