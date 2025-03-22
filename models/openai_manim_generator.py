import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # Load your OpenAI API key from .env

# Set API key
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# Define the prompt
prompt = """
You are an AI specialized in writing Python scripts for Manim Community Edition (manimce), version 0.19.0. 
Only use official modules and syntax supported by ManimCE. 
Do NOT use outdated or unofficial modules like `manim.graph` or `manimlib`.

Create a ManimCE v0.19.0 Python script that explains the concept of a a dot product of two vectors.
- Use a Scene class named DotProduct

- Use `from manim import *` for imports
- Use official ManimCE classes like `Axes`, `MathTex`, `Text`, `Create`, `Write`, `FadeIn`, etc.
- The code must run correctly in the official Docker image `manimcommunity/manim`
- The script should be self-contained, include all necessary imports, and avoid GUI-related preview commands

Do not include explanations or markdown formatting like triple backticks. Only return valid Python code.
"""

# Call GPT-4 Turbo model
response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful AI that only returns valid Python scripts for Manim."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.2
)

# Extract code from response
generated_code = response.choices[0].message.content.strip()
# Remove any ```python tags if present
generated_code = generated_code.replace("```python", "").replace("```", "")


# Write to file
with open("openai_generated/limit_and_continuity.py", "w") as f:
    f.write(generated_code)

print("✅ Code written to limit_and_continuity.py")