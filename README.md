AIVOA - HCP CRM Module 🩺🤖
AIVOA is a specialized CRM module designed for pharmaceutical sales representatives to log and manage interactions with Healthcare Professionals (HCPs). It features a LangGraph-powered AI Assistant for natural language logging and a robust MySQL cloud synchronization system.

🚀 Key Features
Structured HCP Logging: A dedicated form to capture Interaction Type, Duration, and Topics Discussed.

AI Assistant: Powered by Groq (Llama 3.3) to process natural language inputs and automate interaction logging.

Live Cloud Sync: Real-time synchronization with Aiven MySQL Cloud, showing a "SYNCED TO MYSQL" status for every record.

Modern Tech Stack: Built with FastAPI (Backend), React + Tailwind (Frontend), and SQLAlchemy (ORM).

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Axios, Lucide Icons.

Backend: FastAPI, Python 3.13, SQLAlchemy, Uvicorn.

Database: MySQL (Aiven Cloud).

AI/LLM: Groq Cloud API (Llama-3.3-70b-versatile).

⚙️ Installation & Setup
1. Prerequisites
Python 3.10+ installed.

Node.js installed.

A Groq API Key and a MySQL Connection URI (Aiven/Local).

2. Backend Setup


cd backend
python -m venv venv
# Activate venv: (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
Create a .env file in the /backend directory:

Plaintext

DATABASE_URL=mysql+pymysql://avnadmin:your_password@your_host:port/defaultdb?ssl-mode=REQUIRED
GROQ_API_KEY=your_groq_api_key
3. Frontend Setup


cd frontend
npm install
npm run dev
📁 Project Structure
Plaintext

crm-hcp-module/
├── backend/
│   ├── main.py          # FastAPI entry point
│   ├── agent.py         # AI Logic (LangGraph/Groq)
│   ├── database.py      # SQLAlchemy Configuration
│   ├── models.py        # MySQL Database Schema
│   └── requirements.txt # Backend Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # UI Elements (LogInteractionScreen)
│   │   └── store/       # State Management
└── .gitignore           # Safety for Secrets
📝 Deployment Notes
This project is configured for deployment on Render:

Build Command: pip install -r requirements.txt

Start Command: python main.py or uvicorn main:app --host 0.0.0.0 --port $PORT

Environment Variables: Ensure DATABASE_URL uses the mysql+pymysql:// prefix for compatibility.


