import os
from dotenv import load_dotenv
import anthropic

# Load API key
load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")

# Initialize Claude client
client = anthropic.Anthropic(api_key=api_key)

# Load example code
example_code = ""
example_file_path = "manim_positions.py"
if os.path.exists(example_file_path):
    with open(example_file_path, "r") as f:
        example_code = f.read()

# User question
user_question = "explain the dot product concept"

# Construct concise prompt
# prompt = f"""
# The user asked: "{user_question}"

# You are an AI that creates ManimCE math videos with voiceovers.

# Use the following example as inspiration:

# ### Example Code:
# {example_code}

# Now generate:
# 1. A spoken script explaining the concept.
# 2. A ManimCE v0.19.0 Python script using manim-voiceover.
# - Use `from manim import *`
# - Use a class called DotProduct
# - Use vectors, projection, angle, and narration sync
# - Script should be ~30s long, Docker-compatible, and self-contained

# Return only:
# Narration:
# ...
# Code:
# ...

# Do not return anything after the code.
# """

prompt = f"""

Create a new video using manim. 
The video explains the difference between tuple and lists in python. Use code examples as well. 
For the voiceover use the manim-voiceover library. Add explaination for the code examples using manim-voiceover library.  
You can use the code in @manim_positions.py file as an example, and write code similar to that. 

Do not return anything after the code.
"""

# Make request to Claude
response = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=4096,
    temperature=0.3,
    messages=[
        {"role": "user", "content": prompt}
    ]
)

# Extract the response text
full_text = response.content[0].text.strip()

# Split the output
if "Narration:" in full_text and "Code:" in full_text:
    narration = full_text.split("Narration:")[1].split("Code:")[0].strip()
    code = full_text.split("Code:")[1].strip()
else:
    print("⚠️ Unexpected output format.")
    narration = full_text
    code = ""

# Save to output
os.makedirs("claude_output", exist_ok=True)
with open("claude_output/narration.txt", "w") as f:
    f.write(narration)

with open("claude_output/dot_product_scene.py", "w") as f:
    f.write(code)

print("✅ Narration and code saved to 'claude_output/' folder.")
