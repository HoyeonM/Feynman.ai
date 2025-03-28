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

# Serve static files
app.mount("/back", StaticFiles(directory="."), name="static")

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

        # Ensure media directory exists
        media_dir = os.path.join("media", "videos", "output_manim_script_from_audio", "480p15")
        os.makedirs(media_dir, exist_ok=True)

        cmd = [
            "docker", "run", "--rm",
            "-v", f"{cwd}:/manim/back",  # Mount to /manim/back
            "-w", "/manim/back",  # Set working directory
            "manim-clean", "manim",
            "-ql",  # Quality low for faster rendering
            "--media_dir", "media",  # Specify media output directory
            script_path,
            class_name
        ]

        logger.info(f"🚀 Running Docker command: {' '.join(cmd)}")
        logger.info(f"💾 Current working directory: {cwd}")
        logger.info(f"📜 Script path: {script_path}")
        logger.info(f"📁 Media directory: {media_dir}")

        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True, encoding="utf-8")
            logger.info(f"✅ Docker stdout:\n{result.stdout}")
            if result.stderr:
                logger.info(f"⚠️ Docker stderr:\n{result.stderr}")

            # Verify video was created
            expected_video_path = os.path.join(media_dir, f"{class_name}.mp4")
            if not os.path.exists(expected_video_path):
                raise Exception(f"Video file was not created at expected path: {expected_video_path}")
            logger.info(f"✅ Video file created successfully at: {expected_video_path}")
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Docker execution failed:\n{e.stderr or e.stdout}")
            raise HTTPException(status_code=500, detail=f"Docker error: {e.stderr or e.stdout}")
        except Exception as e:
            logger.error(f"❌ Error after Docker execution: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

        return JSONResponse({
            "status": "success",
            "transcript": transcript,
            "manim_code": code,
            "className": class_name,
            "message": "Video generated successfully"
        })

    except Exception as e:
        logger.error("❌ Exception occurred during transcription request", exc_info=True)
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
            "-v", f"{cwd}:/manim",  # Mount to /manim/back instead of /manim
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
            error_msg = e.stderr or e.stdout or str(e)
            logger.error(f"❌ Docker execution failed:\n{error_msg}")
            raise HTTPException(status_code=500, detail=f"Docker error: {error_msg}")
        except Exception as e:
            logger.error(f"❌ Error after Docker execution: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

        # Return success response with class name
        return JSONResponse({
            "status": "success",
            "className": class_name,
            "manim_code": code,
            "message": "Video generated successfully"
        })

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        logger.error("❌ Exception occurred during text request", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")