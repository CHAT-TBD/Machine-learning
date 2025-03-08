import tensorflow as tf
import numpy as np
import tensorflowjs as tfjs

# สร้างโมเดล (LSTM)
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=5000, output_dim=64),
    tf.keras.layers.LSTM(128, return_sequences=True),
    tf.keras.layers.LSTM(128),
    tf.keras.layers.Dense(5000, activation="softmax")
])

# คอมไพล์โมเดล
model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

# สร้างข้อมูลตัวอย่าง
X_train = np.random.randint(5000, size=(1000, 10))
y_train = np.random.randint(5000, size=(1000,))

# เทรนโมเดล
model.fit(X_train, y_train, epochs=10)

# แปลงโมเดลเป็น TensorFlow.js
tfjs.converters.save_keras_model(model, "chatbot_model")