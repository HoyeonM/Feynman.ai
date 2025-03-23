import os
from openai import OpenAI
from dotenv import load_dotenv

def generate_manim_code_openai(save_converted_path):
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)

    # Read the user's math question
    with open(save_converted_path, "r") as f:
        user_question = f.read().strip()

    print("User question:", user_question)

    # Load two example scripts
    example_paths = ["sample_manim_script/manim_positions.py", "sample_manim_script/approximating_tau.py", "sample_manim_script/QuadraticFormulaShort_English.py"]
    example_code = ""
    for path in example_paths:
        if os.path.exists(path):
            with open(path, "r") as f:
                code = f.read().strip()
                # first example
                example_code += "Example:\n" + code + "\n\n"
                # second example
                example_code += code
        else:
            print(f"⚠️ Warning: {path} not found.")

    print("example_code:", example_code)
    # Few-shot prompt with both examples
    prompt2 = f"""
When a user asks a question: '{user_question}', generate:

1. A narration to explain the concept step by step  
2. A matching Manim script with narration that:
- Uses GTTSService
- Animates the concept using Create, Write, Vector, Axes, MathTex, etc.
- Includes proper timing, layout, and fade/transform transitions
- Avoids GUI dependencies
- Follows this style:
{example_code}

⚠️ Return only:

Code:
<valid python script>

Do not return anything after the code.
"""

    preset = """
You are a Manim animation script generator. 
You always return clean, valid Python code using Manim Community Edition v0.19.0 
that is ready to run in a Docker container. 
The code must include narration with GTTSService and follow good design practices: 

Design Guidelines:
- Remove previous objects (e.g., with FadeOut, Unwrite) when no longer referenced.
- Avoid overcrowding: show only 3–5 items at once.
- Keep visual focus on one idea at a time.
- Ensure explanatory text doesn’t overlap other elements.
- Use positioning functions like .to_edge(), .next_to(), and .align_to() for clarity.
- Use VGroup to group and animate/remove related elements together.
- Add transition animations when changing topics to improve flow.
- Make sure each visual element appears only when relevant and is removed afterward.
"""

    # Make the API call
    print("Generating Manim code...")
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": preset},
            {"role": "user", "content": prompt2}
        ],
        temperature=0.5
    )

    # Parse and extract Python code from model output
    full_text = response.choices[0].message.content.strip()

    if "Code:" in full_text:
        code = full_text.split("Code:")[1].strip()
    else:
        code = full_text

    # Remove any Markdown fences
    if code.startswith("```python"):
        code = code[len("```python"):].strip()
    if code.endswith("```"):
        code = code[:-3].strip()

    return code