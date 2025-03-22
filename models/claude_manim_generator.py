import os
from dotenv import load_dotenv
import anthropic

# Load API key
load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")

# Initialize Claude client
client = anthropic.Anthropic(api_key=api_key)

# User input
user_question = "explain the dot product concept"

# Claude system + user prompt
# prompt = f"""
# You are an AI specialized in creating content for educational math videos.

# Create a new video using manim. 
# When a user asks a question like "{user_question}", respond with:

# The video explains the concept of dot product of two vectors. Use examples as well. 
# For the voiceover use the manim-voiceover library. Add explaination for the code examples using manim-voiceover library.  
# You can use the code in @manim_positions.py file as an example, and write code similar to that. 
# Create new file if not exists

# 2. A **valid Manim Community Edition v0.19.0 Python script** that animates the concept. The script should:
# - Use `from manim import *`
# - Define a Scene class named DotProduct
# - Use official ManimCE classes like `Axes`, `Vector`, `MathTex`, `Angle`, `Text`, `Create`, `Write`, `FadeIn`, etc.
# - Animate two vectors from the origin, show their angle, and projection
# - Add animations so that it will match the narration in terms of concepts
# - Use `run_time` and `self.wait()` to ensure the video is ~30 seconds long
# - Be self-contained and Docker-compatible (no GUI commands)

# ⚠️ Do NOT include any explanations, markdown formatting, or commentary. Just return:

# """

prompt = f"""
You are an AI specialized in creating content for educational math videos.

Create a new video using manim. 
When a user asks a question like "{user_question}", respond with:

The video explains the concept of dot product of two vectors. Use examples as well. 
For the voiceover use the manim-voiceover library. Add explaination for the code examples using manim-voiceover library.  
You can use the code in @manim_positions.py file as an example, and write code similar to that. 
Create new file if not exists

2. A **valid Manim Community Edition v0.19.0 Python script** that animates the concept. The script should:
- Use `from manim import *`
- Define a Scene class named DotProduct
- Use official ManimCE classes like `Axes`, `Vector`, `MathTex`, `Angle`, `Text`, `Create`, `Write`, `FadeIn`, etc.
- Animate two vectors from the origin, show their angle, and projection
- Add animations so that it will match the narration in terms of concepts
- Use `run_time` and `self.wait()` to ensure the video is ~30 seconds long
- Be self-contained and Docker-compatible (no GUI commands)

⚠️ Do NOT include any explanations, markdown formatting, or commentary. Just return:
- 
"""

# Make request to Claude
response = client.messages.create(
    model="claude-3-opus-20240229",  # or claude-3-sonnet if preferred
    max_tokens=4096,
    temperature=0.3,
    messages=[
        {"role": "user", "content": prompt}
    ]
)

# Extract the response text
full_text = response.content[0].text.strip()

# Split the narration and code
if "Narration:" in full_text and "Code:" in full_text:
    narration = full_text.split("Narration:")[1].split("Code:")[0].strip()
    code = full_text.split("Code:")[1].strip()
else:
    print("⚠️ Unexpected output format.")
    narration = full_text
    code = ""

# Save to files
os.makedirs("claude_output", exist_ok=True)

with open("claude_output/narration.txt", "w") as f:
    f.write(narration)

with open("claude_output/dot_product_scene.py", "w") as f:
    f.write(code)

print("✅ Narration and code saved to 'claude_output/' folder.")
