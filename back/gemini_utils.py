import google.generativeai as genai

genai.configure(api_key='AIzaSyBzZ5NlklcBDX8HhY-YTZIa0gXgjiO_lao')

model = genai.GenerativeModel("gemini-2.0-flash")
instruction = "You are an math teacher. You should explain the user's question step by step and make sure keep checking the user's understanding and encourage them to ask questions."
chat = None


def initialize_teacher_chat():
    global chat
    if chat is None:
        chat = model.start_chat(history=[
            {
                "role": "system",
                "parts": instruction
            }
        ])

def generate_gemini_reply_as_teacher(parts):
    initialize_teacher_chat()
    response = chat.send_message(parts)
    return response.text

def make_image_part(image_path):
    with open(image_path, "rb") as f:
        image_data = f.read()
    return {
        "inline_data": {
            "mime_type": "image/jpeg",
            "data": image_data
        }
    }