from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, database
from agent import hcp_agent
from typing import List

# Initialize Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AI-First CRM API")

# Setup CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for Validation
class ChatRequest(BaseModel):
    message: str

class InteractionCreate(BaseModel):
    hcp_name: str
    notes: str
    interaction_type: str

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """
    Endpoint to process conversational interactions using LangGraph.
    """
    try:
        # Pass the message to the LangGraph agent
        inputs = {"messages": [("user", request.message)]}
        config = {"configurable": {"thread_id": "1"}} # Basic threading
        
        result = hcp_agent.invoke(inputs, config)
        
        # Extract the AI's response
        ai_reply = result["messages"][-1].content
        
        return {"reply": ai_reply}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Agent processing failed.")

@app.post("/log-manual")
async def log_manual_interaction(data: InteractionCreate, db: Session = Depends(get_db)):
    """
    Endpoint for the Structured Form submission.
    """
    new_entry = models.Interaction(
        hcp_name=data.hcp_name,
        raw_notes=data.notes,
        interaction_type=data.interaction_type,
        summary="Manually logged via form."
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return {"status": "success", "id": new_entry.id}

@app.get("/interactions")
async def get_all_interactions(db: Session = Depends(get_db)):
    return db.query(models.Interaction).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)