from sqlalchemy import Column, String, Boolean
from database import Base

class Consent(Base):
    __tablename__ = "consents"

    id = Column(String, primary_key=True)
    user_id = Column(String)
    dataset_id = Column(String)
    approved = Column(Boolean, default=False)
