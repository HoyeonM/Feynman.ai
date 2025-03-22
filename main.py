from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import HTTPException
import os, shutil

from dotenv import load_dotenv
from speech_utils import transcribe_audio

load_dotenv()
print("✅ GOOGLE_APPLICATION_CREDENTIALS =", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

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
async def transcribe(file: UploadFile = File(...)):
    try:
        print(f"🎙️ Received file: {file.filename}")
        ext = os.path.splitext(file.filename)[1].lower()
        saved_path = os.path.join(UPLOAD_DIR, f"input{ext}")

        # Save file
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # STT
        if ext in [".wav", ".mp3"]:
            transcript = transcribe_audio(saved_path)
            print(f"🧠 Transcribed text: {transcript}")
            if not transcript:
                raise HTTPException(status_code=400, detail="Failed to transcribe audio.")
            return JSONResponse({"transcript": transcript})
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")