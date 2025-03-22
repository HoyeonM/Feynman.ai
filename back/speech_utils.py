from google.cloud import speech_v1 as speech
from google.cloud import texttospeech
import io
import os
from pydub import AudioSegment

def convert_to_linear16(input_path, output_path):
    audio = AudioSegment.from_file(input_path)
    audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
    audio.export(output_path, format="wav")

def transcribe_audio(path):
    print("Transcribing audio...")

    if not os.path.exists(path):
        print("❌ File not found:", path)
        return ""

    size = os.path.getsize(path)
    print("📏 File size:", size)

    if size < 100:
        print("❗ File too small, probably broken.")
        return ""

    try:
        client = speech.SpeechClient()

        with io.open(path, "rb") as audio_file:
            content = audio_file.read()
            print("Audio content read.")

        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US"
        )

        response = client.recognize(config=config, audio=audio)
        print("🧠 STT response:", response)

        transcripts = [res.alternatives[0].transcript for res in response.results if res.alternatives]
        full_transcript = " ".join(transcripts)
        print("✅ Transcription complete.")
        return full_transcript

    except Exception as e:
        print("❌ Google STT ERROR:", e)
        raise


def synthesize_speech(text, output_path):
    client = texttospeech.TextToSpeechClient()

    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    with open(output_path, "wb") as out:
        out.write(response.audio_content)
