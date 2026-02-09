from sqlalchemy import Column, String, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    is_member = Column(Boolean, default=True)
