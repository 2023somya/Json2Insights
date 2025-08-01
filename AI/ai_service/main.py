from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from models.ChatHistory import ChatHistory
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import requests
import os
from pathlib import Path
from huggingface_hub import InferenceClient
from huggingface_hub import model_info
print(model_info("mistralai/Mixtral-8x7B-Instruct-v0.1"))

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

#from openai import OpenAI

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
#openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# Load environment variables from .env
#load_dotenv()
#print("API KEY LOADED:", os.getenv("OPENAI_API_KEY"))




# MongoDB connection
#MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["revenueDB"]  # Replace with your actual DB name

# Initialize FastAPI
app = FastAPI()

# Set OpenAI API key


collection = db["quarterlyrevenues"]  # Replace with your actual collection name

# Request schema
class PromptInput(BaseModel):
    prompt: str

# Helper function to fetch sample context from DB
def get_sample_data(limit=10):
    print("Connecting to MongoDB and fetching data...")
    records = list(collection.find().limit(limit))
    print(f"Number of records fetched from MongoDB: {len(records)}")
    if not records:
        print("No records found in MongoDB collection.")
        return None
    context = "\n".join([
        f"Customer: {r.get('customerName')}, Q3: {r.get('q3Revenue')}, Q4: {r.get('q4Revenue')}, "
        f"Var: {r.get('variance')}, %Var: {r.get('variancePercent')}"
        for r in records
    ])
    return context

def query_huggingface(prompt: str, context: str = None):
    try:
        # Initialize client (automatically handles API endpoints)
        client = InferenceClient(token=HUGGINGFACE_API_KEY)
        
        # Structured financial prompt
        messages = [{
            "role": "user",
            "content": f"""Analyze this financial data:
            {context if context else 'No context provided'}
            
            Question: {prompt}
            
            Provide: answer to the question in 2-3 lines"""
            
        }]
        
        # Generate response
        response = client.chat_completion(
            messages = messages,
            model="mistralai/Mixtral-8x7B-Instruct-v0.1",
            max_tokens=600,
            temperature=0.2,
            #repetition_penalty=1.1
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )







  #  headers = {
  #      "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
  #      "Content-Type": "application/json"
  #  }
  #  API_URL = "https://api-inference.huggingface.co/pipeline/text-generation/mistralai/Mistral-7B-Instruct-v0.2"
  #  
  #  payload_text = ("You are a financial analyst. Provide detailed analysis with calculations when needed.\n"
  #      f"Question: {prompt}\n\n"
  #      f"Relevant Data:\n{context if context else 'No additional context provided'}")
  #  payload = {
  #      "inputs": payload_text,
  #      "parameters": {
  #          "max_new_tokens": 512,  # Increased for detailed financial analysis
  #          "temperature": 0.3,     # Lower for precise financial responses
  #          #"top_p": 0.9,
  #          #"repetition_penalty": 1.2,
  #          "return_full_text": False

  #      }
  #  }
  #  print("Sending request to Hugging Face Inference API...")
  #  print("Request payload:", payload)
  #  response = requests.post(
  #      API_URL,
  #      headers=headers,
  #      json=payload,
   #     timeout=30
  #  )
  #  response.raise_for_status()
  #  print("Raw response:", response.text[:200])
  #  print("Received status code:", response.status_code)
  #  print("Response content:", response.text)
  #  print(response.json())
  #  if not response.text.strip():
  #          raise ValueError("Empty response from API")
#
  #  if response.status_code == 200:
   #     #return response.json()[0]["generated_text"]
   #     return response.json()[0]["generated_text"]
   # else:
    #    raise Exception(f"Hugging Face API error: {response.status_code} - {response.text}")



# Add CORS middleware (needed for frontend-backend communication)
chat_history_model = ChatHistory(db)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/save-chat")
async def save_chat(chat_data: dict):
    try:
        chat_id = chat_history_model.create_chat(
            user_id=chat_data.get("user_id", "anonymous"),
            messages=chat_data["messages"]
        )
        return {"success": True, "chat_id": chat_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/get-chat/{chat_id}")
async def get_chat(chat_id: str):
    try:
        chat = chat_history_model.get_chat(chat_id)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        chat["_id"] = str(chat["_id"])  # Convert ObjectId to string
        return chat
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/get-user-chats/{user_id}")
async def get_user_chats(user_id: str):
    try:
        chats = chat_history_model.get_user_chats(user_id)
        for chat in chats:
            chat["_id"] = str(chat["_id"])
        return {"chats": chats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI endpoint
@app.post("/ask-ai")
def ask_ai(payload: PromptInput):
    print("Fetching sample data from MongoDB...")
    context = get_sample_data()
    if not context:
        print("No context data found.")
        raise HTTPException(status_code=404, detail="No data found in MongoDB")

    full_prompt = f"{payload.prompt}\n\nRelevant Data:\n{context}"

    try:
        response = query_huggingface(
                prompt=payload.prompt,
                context=context if context else "No financial records found"
            )   
        
        return {"answer": response.strip(),
                "context_used" : bool(context)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"error: {str(e)}")
