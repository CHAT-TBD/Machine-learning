from transformers import AutoTokenizer, AutoModelForSeq2SeqLM  
import torch  

# ใช้โมเดล mT5 (รองรับภาษาไทย)  
model_name = "google/mt5-small"  
tokenizer = AutoTokenizer.from_pretrained(model_name)  
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)  

# ฟังก์ชันให้ AI สร้างคำตอบที่ตรงคำถาม  
def chatbot_response(question):  
    prompt = f"ตอบคำถามต่อไปนี้อย่างถูกต้อง: {question}"  
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)  

    with torch.no_grad():  
        outputs = model.generate(**inputs, max_length=50, num_return_sequences=1)  

    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)  
    return answer  

# วนลูปรับอินพุตจากผู้ใช้
print("พิมพ์ 'exit' เพื่อจบการสนทนา")
while True:
    question = input("คุณ: ")
    if question.lower() == "exit":
        print("Chatbot: ขอบคุณที่คุยกับฉัน!")
        break
    
    answer = chatbot_response(question)
    print("Chatbot:", answer)
