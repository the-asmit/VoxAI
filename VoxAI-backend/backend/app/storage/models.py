from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


class CallSession(Base):
    """
    Represents a single phone call session.
    """
    __tablename__ = "call_sessions"

    call_id = Column(String(255), primary_key=True, index=True)
    profile = Column(String(100), nullable=False)
    status = Column(String(50), default="active")  # active, ended, abandoned
    started_at = Column(DateTime, nullable=False)  # Application must set with datetime.now(timezone.utc)
    ended_at = Column(DateTime, nullable=True)

    # Relationship to transcript events
    transcript_events = relationship(
        "TranscriptEvent",
        back_populates="call_session",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<CallSession(call_id={self.call_id}, profile={self.profile}, status={self.status})>"


class TranscriptEvent(Base):
    """
    Represents a single transcript exchange in a call.
    """
    __tablename__ = "transcript_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    call_id = Column(String(255), ForeignKey("call_sessions.call_id"), nullable=False, index=True)
    turn_id = Column(Integer, nullable=False)
    role = Column(String(20), nullable=False)  # "user" or "assistant"
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, index=True)  # Application must set with datetime.now(timezone.utc)

    # Relationship back to call session
    call_session = relationship("CallSession", back_populates="transcript_events")

    def __repr__(self):
        return f"<TranscriptEvent(call_id={self.call_id}, turn_id={self.turn_id}, role={self.role})>"
