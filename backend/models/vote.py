from sqlalchemy import Column, String, Boolean
from database import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(String, primary_key=True)
    proposal_id = Column(String)
    user_id = Column(String)
    support = Column(Boolean)
