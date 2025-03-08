import pickle
import sqlite3
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Embedding
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# โหลดข้อมูลจากฐานข้อมูล
def load_data():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT question, answer FROM chatbot_feedback WHERE feedback='good'")
    data = cursor.fetchall()
    conn.close()
    return data

# เทรนโมเดลจากข้อมูลในฐานข้อมูล
def train_model():
    data = load_data()
    
    if len(data) < 10:
        print("ข้อมูลยังน้อยเกินไปสำหรับการเทรน!")
        return
    
    questions, answers = zip(*data)
    tokenizer = Tokenizer(num_words=1000)
    tokenizer.fit_on_texts(questions + answers)

    X = tokenizer.texts_to_sequences(questions)
    y = tokenizer.texts_to_sequences(answers)

    X = pad_sequences(X, maxlen=10)
    y = pad_sequences(y, maxlen=10)

    model = Sequential([
        Embedding(input_dim=1000, output_dim=64, input_length=10),
        LSTM(64, return_sequences=True),
        LSTM(64),
        Dense(1000, activation="softmax")
    ])

    model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])
    model.fit(X, np.array(y), epochs=5)

    # บันทึกโมเดล
    with open("chatbot_model.pkl", "wb") as f:
        pickle.dump((model, tokenizer), f)

    print("โมเดลถูกเทรนและบันทึกเรียบร้อย!")

if __name__ == "__main__":
    train_model()
