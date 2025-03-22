import os
from dotenv import load_dotenv
import anthropic

# Load Claude API key from .env
load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")

# Initialize Claude client
client = anthropic.Anthropic(api_key=api_key)

def generate_manim_video_files(path):
    """
    Given a user question, call Claude and generate:
    - narration.txt (voiceover text)
    - dot_product_scene.py (manim script)

    Returns: tuple of (narration: str, manim_code: str)
    """
    print("Yout are in Claude function")
    with open (path, "r") as file:
        user_question = file.read()
    print("User question:", user_question)
    prompt = f"""
You are an AI specialized in creating content for educational math videos.

Create a new video using manim. 
When a user asks a question like "{user_question}", respond with:

The video explains the concept of dot product of two vectors. Use examples as well. 
For the voiceover use the manim-voiceover library. Add explaination for the code examples using manim-voiceover library.  
You can use the code in @manim_positions.py file as an example, and write code similar to that. 

2. A **valid Manim Community Edition v0.19.0 Python script** that animates the concept. The script should:
- Use `from manim import *`
- Define a Scene class named DotProduct
- Use official ManimCE classes like `Axes`, `Vector`, `MathTex`, `Angle`, `Text`, `Create`, `Write`, `FadeIn`, etc.
- Animate two vectors from the origin, show their angle, and projection
- Add animations so that it will match the narration in terms of concepts
- Use `run_time` and `self.wait()` to ensure the video is ~30 seconds long
- Be self-contained and Docker-compatible (no GUI commands)

Do NOT include any explanations, markdown formatting, or commentary. Just return:
Narration:
... (your narration text here)
Code:
... (your Manim script here)
"""

    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=4096,
        temperature=0.3,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    full_text = response.content[0].text.strip()

    # Parse narration & code
    if "Narration:" in full_text and "Code:" in full_text:
        narration = full_text.split("Narration:")[1].split("Code:")[0].strip()
        code = full_text.split("Code:")[1].strip()
    else:
        print("⚠️ Unexpected output format.")
        narration = full_text
        code = ""

    return narration, code
