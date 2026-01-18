import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
# Import your tools from the tools.py file
from tools import log_interaction, edit_interaction, get_hcp_history, compliance_check, schedule_followup

# 1. Load the environment variables from .env
load_dotenv()

# 2. Initialize the model as per requirements (gemma2-9b-it)
llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# 3. Define the mandatory 5 tools
tools = [
    log_interaction, 
    edit_interaction, 
    get_hcp_history, 
    compliance_check, 
    schedule_followup
]

# 4. Define the agent (This MUST be named hcp_agent for main.py to work)
hcp_agent = create_react_agent(llm, tools)