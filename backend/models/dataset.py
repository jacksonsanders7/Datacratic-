from sqlalchemy import Column, String, Boolean
from database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True)
    owner_id = Column(String)
    data_type = Column(String)
    pooled = Column(Boolean, default=False)
