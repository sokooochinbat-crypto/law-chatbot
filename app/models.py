from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# =========================
# USER TABLE
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # холбоос (1 user → олон chat)
    chats = relationship("Chat", back_populates="user")


# =========================
# CHAT TABLE
# =========================
class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    reply = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    # user холбоос
    user = relationship("User", back_populates="chats")