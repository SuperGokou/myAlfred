# backend/server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
from fastapi.middleware.cors import CORSMiddleware
import torch

# 1. SETUP THE APP
app = FastAPI()

# Allow your React app (localhost:3000) to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. LOAD YOUR SPECIFIC MODEL
# NOTE: Ensure this path is 100% correct. Windows paths use backslashes.
MODEL_PATH = r"J:\Project Files\MyPython\textModelh2\model"

print(f"Loading model from {MODEL_PATH}... this may take a minute.")

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    # Fallback to a tiny model if local path fails (just so server doesn't crash)
    print("Using fallback 'gpt2' model for testing...")
    tokenizer = AutoTokenizer.from_pretrained("gpt2")
    model = AutoModelForCausalLM.from_pretrained("gpt2")

# 3. DEFINE THE DATA FORMAT
class Query(BaseModel):
    prompt: str

# 4. CREATE THE API ENDPOINT
@app.post("/chat")
async def generate_response(query: Query):
    try:
        # Create input
        inputs = tokenizer.encode(query.prompt + tokenizer.eos_token, return_tensors="pt")

        # Generate output
        outputs = model.generate(
            inputs,
            max_length=100,
            pad_token_id=tokenizer.eos_token_id,
            do_sample=True,
            temperature=0.7
        )

        # Decode output
        response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # Simple cleanup (remove the original prompt from the answer if needed)
        # response_text = response_text.replace(query.prompt, "")

        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: python -m uvicorn server:app --reload --port 8000