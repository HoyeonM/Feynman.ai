from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import HTTPException
import os, shutil
from dotenv import load_dotenv
from speech_utils import transcribe_audio
from speech_utils import convert_to_linear16
from models.openai_manim_generator_func_example import generate_manim_code_openai
from pydantic import BaseModel
from extracting_class_from_script import extract_class_name
import subprocess
import logging
import time
os.makedirs("logs", exist_ok=True)

# Set up logging to both file and console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(f"logs/log_{time.strftime('%Y%m%d-%H%M%S')}.log"),  # Log to file
        logging.StreamHandler()  # Log to console
    ]
)

logger = logging.getLogger(__name__)

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

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/transcribe")
async def transcribe(voice: UploadFile = File(...)):
    try:
        logger.info(f"🎙️ Received file: {voice.filename}")
        logger.info(f"📁 Content type: {voice.content_type}")

        # Fix extension
        import mimetypes
        ext = mimetypes.guess_extension(voice.content_type) or ".wav"
        logger.info(f"📎 Using extension: {ext}")

        saved_path = os.path.join(VOICE_UPLOAD_DIR, f"input{ext}")
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(voice.file, buffer)

        converted_path = os.path.join(VOICE_UPLOAD_DIR, "converted.wav")
        convert_to_linear16(saved_path, converted_path)
        logger.info(f"✅ Audio converted: {converted_path}")

        # Transcribe
        transcript = transcribe_audio(converted_path)
        logger.info(f"🧠 Transcribed text: {transcript}")

        # Save transcript
        save_converted_path = os.path.join(VOICE_UPLOAD_DIR, "transcript.txt")
        manim_output_path = os.path.join(OUTPUT_DIR, "output_manim_script_from_audio.py")

        with open(save_converted_path, "w", encoding="utf-8") as f:
            f.write(transcript)

        try:
            code = generate_manim_code_openai(save_converted_path)
        except Exception as e:
            logger.info(f"❌ Error generating manim code: {e}")
            raise HTTPException(status_code=500, detail="Error during code generation.")

        logger.info("✅ Manim code generated.")

        with open(manim_output_path, "w", encoding="utf-8") as f:
            f.write(code)

        # Get class name from the generated code
        class_name = extract_class_name(code)
        logger.info(f"🎬 Class name: {class_name}")

        # Docker execution
        cwd = os.getcwd().replace("\\", "/")
        script_path = "output/output_manim_script_from_audio.py"

        cmd = [
            "docker", "run", "--rm",
            "-v", f"{cwd}:/manim",
            "manim-clean", "manim",
            script_path,
            class_name
        ]

        logger.info("🚀 Running Docker command:")
        logger.info(" ".join(cmd))

        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True, encoding="utf-8")
            logger.info("✅ Docker stdout:\n" + result.stdout)
            logger.info("✅ Docker stderr:\n" + result.stderr)
        except subprocess.CalledProcessError as e:
            logger.info("❌ Docker execution failed")
            logger.info("🔴 stderr:\n" + e.stderr)
            logger.info("🔴 stdout:\n" + e.stdout)
            raise HTTPException(status_code=500, detail=f"Docker error: {e.stderr or e.stdout}")

        return JSONResponse({
            "status": "ok",
            "transcript": transcript,
            "manim_code": code
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



class TextInput(BaseModel):
    message: str
@app.post("/text")
async def receive_text(data: TextInput):
    try:
        logger.info(f"📝 Received Text: {data.message}")
        saved_path = os.path.join(TEXT_UPLOAD_DIR, "input.txt")
        manim_output_path = os.path.join(OUTPUT_DIR, "output_manim_script.py")

        # Save the input
        with open(saved_path, "w", encoding="utf-8") as f:
            f.write(data.message)

        try:
            code = generate_manim_code_openai(saved_path)
        except Exception as e:
            logger.info("Error generating manim code:", e)

        logger.info("Manim code generated.")
        # Save outputs
        with open(manim_output_path, "w", encoding="utf-8") as f:
            f.write(code)

        # open shell and run the manim code
        class_name = extract_class_name(code)
        logger.info("Class name:", class_name)
        # Get current working directory and convert to Docker-friendly path
        cwd = os.getcwd().replace("\\", "/")
        script_path = "output/output_manim_script.py"  # Unix-style path for Docker

        # Construct Docker command
        cmd = [
            "docker", "run", "--rm",
            "-v", f"{cwd}:/manim",
            "manim-clean", "manim", "-ql",
            script_path,
            class_name
        ]

        logger.info("🚀 Running Docker command:")
        logger.info(" ".join(cmd))  # Log the exact command

        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True, encoding="utf-8")
            logger.info("✅ Docker stdout:\n", result.stdout)
            logger.info("✅ Docker stderr:\n", result.stderr)
        except subprocess.CalledProcessError as e:
            logger.info("❌ Docker execution failed")
            logger.info("🔴 stderr:\n", e.stderr)
            logger.info("🔴 stdout:\n", e.stdout)
            raise HTTPException(status_code=500, detail=f"Docker error: {e.stderr or e.stdout}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")