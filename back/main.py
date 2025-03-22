from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import HTTPException
import os, shutil
from pydantic import BaseModel
from dotenv import load_dotenv
from speech_utils import transcribe_audio
from speech_utils import convert_to_linear16

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

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/transcribe")
async def transcribe(voice: UploadFile = File(...)):  # <-- changed 'file' to 'voice'
    try:
        print(f"🎙️ Received file: {voice.filename}")
        ext = os.path.splitext(voice.filename)[1].lower()
        saved_path = os.path.join(UPLOAD_DIR, f"input{ext}")

        # Save the uploaded file
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(voice.file, buffer)

        # Convert to LINEAR16
        converted_path = os.path.join(UPLOAD_DIR, "converted.wav")
        convert_to_linear16(saved_path, converted_path)

        # STT supported extensions
        if ext in [".wav", ".mp3"]: 
            print(converted_path)
            transcript = transcribe_audio(converted_path)
            print(f"🧠 Transcribed text: {transcript}")
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
        # add extra function
        return {"status": "ok", "echo": data.message}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
