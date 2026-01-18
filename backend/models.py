from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), index=True)
    interaction_type = Column(String(50))  # 'chat' or 'form'
    summary = Column(Text)                 # AI-generated summary
    raw_notes = Column(Text)               # Original user input
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<Interaction(hcp='{self.hcp_name}', type='{self.interaction_type}')>"