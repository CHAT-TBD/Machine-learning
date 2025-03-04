import pandas as pd
from pythainlp.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ChatbotModel:
    def __init__(self, data_file="data.csv"):
        self.data_file = data_file
        self.load_data()

    def load_data(self):
        self.df = pd.read_csv(self.data_file)
        self.vectorizer = TfidfVectorizer(tokenizer=word_tokenize)
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df["question"])

    def get_response(self, user_input):
        user_tfidf = self.vectorizer.transform([user_input])
        similarity_scores = cosine_similarity(user_tfidf, self.tfidf_matrix)
        max_index = similarity_scores.argmax()
        confidence = similarity_scores[0, max_index]

        if confidence > 0.3:
            return self.df.iloc[max_index]["answer"], max_index
        else:
            return "ขอโทษ ฉันไม่เข้าใจคำถามของคุณ", None

    def update_score(self, index, feedback):
        if index is not None:
            if feedback == "good":
                self.df.at[index, "score"] += 1
            else:
                self.df.at[index, "score"] -= 1
            self.df.to_csv(self.data_file, index=False)

chatbot = ChatbotModel()
