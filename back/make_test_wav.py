import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import wave

fs = 16000
duration = 5

print("🎙️ Recording...")
audio = sd.rec(int(duration * fs), samplerate=fs, channels=1)
sd.wait()

print("📊 audio dtype:", audio.dtype)
audio_int16 = np.int16(audio * 32767)
print("📊 audio_int16 dtype:", audio_int16.dtype)

filename = "uploads/test_input.wav"
write(filename, fs, audio_int16)
print(f"✅ Saved: {filename}")

# 확인
with wave.open(filename, "rb") as f:
    print("📦 Format test:")
    print("  Channels:", f.getnchannels())
    print("  Sample rate:", f.getframerate())
    print("  Sample width (bytes):", f.getsampwidth())