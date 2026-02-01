import os
import random
import edge_tts
import io
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. SETUP
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your React app to talk to this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. TTS (TALKING) SETUP
class TTSRequest(BaseModel):
    text: str
    voice: str = "en-GB-RyanNeural"
    rate: str = "+0%"
    pitch: str = "-5Hz"

@app.post("/api/tts")
async def generate_speech(request: TTSRequest):
    print(f"🎤 TTS: {request.text[:20]}...")
    try:
        communicate = edge_tts.Communicate(
            request.text,
            request.voice,
            rate=request.rate,
            pitch=request.pitch
        )
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]

        return StreamingResponse(io.BytesIO(audio_data), media_type="audio/mpeg")
    except Exception as e:
        print(f"❌ TTS Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 3. SINGING (MUSIC) SETUP
# 👇 FIXED: Use Absolute Path so it finds the folder no matter where you run it from
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SONG_DIR = os.path.join(BASE_DIR, "songs")

@app.get("/api/sing/{query}")
async def get_song(query: str):
    print(f"🎵 Received request for: {query}")
    print(f"📂 Looking in folder: {SONG_DIR}") # Debug log

    # Check folder exists
    if not os.path.exists(SONG_DIR):
        print(f"❌ ERROR: Folder not found at {SONG_DIR}")
        raise HTTPException(status_code=404, detail=f"Songs folder not found at {SONG_DIR}")

    files = [f for f in os.listdir(SONG_DIR) if f.endswith(".mp3")]
    print(f"🎼 Found files: {files}") # Debug log

    if not files:
        raise HTTPException(status_code=404, detail="No MP3 files found in library")

    # Search logic
    selected_song = None
    if query == "random":
        selected_song = random.choice(files)
    else:
        # Simple search: does the filename contain the query?
        for file in files:
            if query.lower().replace(" ", "") in file.lower().replace("_", ""):
                selected_song = file
                break

    # Fallback if specific song not found
    if not selected_song:
        print("⚠️ Song not found, playing random track.")
        selected_song = random.choice(files)

    print(f"▶️ Playing: {selected_song}")
    path = os.path.join(SONG_DIR, selected_song)
    return FileResponse(path, media_type="audio/mpeg")

# 4. RUNNER
if __name__ == "__main__":
    # This runs the server on Port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)