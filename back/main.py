from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import HTTPException
import os, shutil
from dotenv import load_dotenv
from speech_utils import transcribe_audio
from speech_utils import convert_to_linear16
from models.claude_manim_generator import generate_manim_video_files
from pydantic import BaseModel


load_dotenv()

app = FastAPI()
# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
VOICE_UPLOAD_DIR = "uploads/voice"
os.makedirs(VOICE_UPLOAD_DIR, exist_ok=True)

TEXT_UPLOAD_DIR = "uploads/text"
os.makedirs(TEXT_UPLOAD_DIR, exist_ok=True)

@app.post("/transcribe")
async def transcribe(voice: UploadFile = File(...)):
    try:
        print(f"🎙️ Received file: {voice.filename}")
        ext = os.path.splitext(voice.filename)[1].lower()
        saved_path = os.path.join(VOICE_UPLOAD_DIR, f"input{ext}")

        # Save the uploaded file
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(voice.file, buffer)

        # Convert to LINEAR16
        converted_path = os.path.join(VOICE_UPLOAD_DIR, "converted.wav")
        convert_to_linear16(saved_path, converted_path)

        # STT supported extensions
        if ext in [".wav", ".mp3"]: 
            print(converted_path)
            transcript = transcribe_audio(converted_path)
            print(f"🧠 Transcribed text: {transcript}")
            narration, code = generate_manim_video_files(transcript)

            # save
            with open(os.path.join(TEXT_UPLOAD_DIR, "output.txt"), "w", encoding="utf-8") as f:
                f.write(narration)
            with open(os.path.join(TEXT_UPLOAD_DIR, "output.py"), "w", encoding="utf-8") as f:
                f.write(code)

            if not transcript:
                raise HTTPException(status_code=400, detail="Failed to transcribe audio.")
            return JSONResponse({"transcript": transcript})
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    

class TextInput(BaseModel):
    message: str
@app.post("/text")
async def receive_text(data: TextInput):
    try:
        print(f"📝 Received Text: {data.message}")
        saved_path = os.path.join(TEXT_UPLOAD_DIR, "input.txt")
        narration_output_path = os.path.join(TEXT_UPLOAD_DIR, "output.txt")
        manim_output_path = os.path.join(TEXT_UPLOAD_DIR, "output.py")

        # Save the input
        with open(saved_path, "w", encoding="utf-8") as f:
            f.write(data.message)

        # Generate narration + manim code from Claude
        narration, code = generate_manim_video_files(saved_path)
        print("Narration and Manim code generated.")
        # Save outputs
        with open(narration_output_path, "w", encoding="utf-8") as f:
            f.write(narration)
        with open(manim_output_path, "w", encoding="utf-8") as f:
            f.write(code)

        return JSONResponse({
            "status": "ok",
            "narration": narration,
            "manim_code": code,
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")