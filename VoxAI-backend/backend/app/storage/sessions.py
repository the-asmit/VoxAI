import asyncio
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, update, insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.storage.models import CallSession, TranscriptEvent
from app.utils.logger import logger


async def _safe_commit(session: AsyncSession, max_retries: int = 3) -> None:
    """
    Safely commit database changes with exponential backoff retry logic.
    
    SQLite can lock during concurrent access. This helper retries commits
    with exponential backoff to handle transient lock issues.
    
    Args:
        session: Async SQLAlchemy session
        max_retries: Maximum number of retry attempts (default: 3)
        
    Raises:
        Exception: If all retries fail, propagates the last exception to caller
    """
    for attempt in range(max_retries):
        try:
            await session.commit()
            return
        except Exception as e:
            if attempt < max_retries - 1:
                # Exponential backoff: 0.1s, 0.2s, 0.4s, ...
                wait_time = 0.1 * (2 ** attempt)
                logger.warning(f"DB commit failed (attempt {attempt + 1}/{max_retries}), retrying in {wait_time:.1f}s: {e}")
                await asyncio.sleep(wait_time)
            else:
                logger.error(f"DB commit failed after {max_retries} attempts: {e}")
                raise


async def create_call_session(
    session: AsyncSession,
    call_id: str,
    profile: str
) -> CallSession:
    """
    Create a new call session record.
    
    Args:
        session: Async SQLAlchemy session
        call_id: Unique call identifier
        profile: Agent profile name
        
    Returns:
        CallSession instance
    """
    call_session = CallSession(
        call_id=call_id,
        profile=profile,
        status="active",
        started_at=datetime.now(timezone.utc)
    )
    session.add(call_session)
    await _safe_commit(session)
    await session.refresh(call_session)
    return call_session


async def get_or_create_call_session(
    session: AsyncSession,
    call_id: str,
    profile: str
) -> CallSession:
    """
    Get existing call session or create new one (idempotent).
    
    Uses SQLite upsert (INSERT ... ON CONFLICT DO NOTHING) to handle
    race conditions where multiple webhooks arrive for the same call_id
    before first is committed.
    
    Args:
        session: Async SQLAlchemy session
        call_id: Unique call identifier
        profile: Agent profile name
        
    Returns:
        CallSession instance (existing or newly created)
    """
    # Try upsert: insert if not exists, do nothing if exists
    stmt = sqlite_insert(CallSession).values(
        call_id=call_id,
        profile=profile,
        status="active",
        started_at=datetime.now(timezone.utc)
    ).on_conflict_do_nothing()
    
    await session.execute(stmt)
    await _safe_commit(session)
    
    # Fetch the session (either just created or already existed)
    return await get_call_session(session, call_id)


async def end_call_session(
    session: AsyncSession,
    call_id: str
) -> bool:
    """
    Mark a call session as ended.
    
    Args:
        session: Async SQLAlchemy session
        call_id: Call identifier
        
    Returns:
        True if updated, False if not found
    """
    result = await session.execute(
        update(CallSession)
        .where(CallSession.call_id == call_id)
        .values(status="ended", ended_at=datetime.now(timezone.utc))
    )
    await _safe_commit(session)
    return result.rowcount > 0


async def save_transcript_event(
    session: AsyncSession,
    call_id: str,
    turn_id: int,
    role: str,
    text: str
) -> TranscriptEvent:
    """
    Save a transcript event (user or assistant message).
    
    Args:
        session: Async SQLAlchemy session
        call_id: Call identifier
        turn_id: Turn number in conversation
        role: "user" or "assistant"
        text: Message content
        
    Returns:
        TranscriptEvent instance
    """
    event = TranscriptEvent(
        call_id=call_id,
        turn_id=turn_id,
        role=role,
        text=text,
        created_at=datetime.now(timezone.utc)
    )
    session.add(event)
    await _safe_commit(session)
    await session.refresh(event)
    return event


async def get_call_transcript(
    session: AsyncSession,
    call_id: str
) -> list[TranscriptEvent]:
    """
    Retrieve all transcript events for a call in chronological order.
    
    Args:
        session: Async SQLAlchemy session
        call_id: Call identifier
        
    Returns:
        List of TranscriptEvent instances, ordered by creation time
    """
    result = await session.execute(
        select(TranscriptEvent)
        .where(TranscriptEvent.call_id == call_id)
        .order_by(TranscriptEvent.created_at.asc())
    )
    return result.scalars().all()


async def get_call_session(
    session: AsyncSession,
    call_id: str
) -> CallSession | None:
    """
    Retrieve a call session by ID.
    
    Args:
        session: Async SQLAlchemy session
        call_id: Call identifier
        
    Returns:
        CallSession instance or None if not found
    """
    result = await session.execute(
        select(CallSession).where(CallSession.call_id == call_id)
    )
    return result.scalar_one_or_none()


async def cleanup_stale_sessions(timeout_minutes: int = 1440) -> None:
    """
    Mark sessions as abandoned if they have been active for longer than timeout.
    
    This prevents DB bloat from orphaned call sessions (calls that crashed
    before sending call.ended event).
    
    Args:
        timeout_minutes: Sessions older than this are marked abandoned (default: 24 hours)
        
    Side effects:
        - Updates CallSession records in database
        - Logs count of cleaned sessions
        - Never raises exceptions (logs errors instead)
    """
    from app.storage.database import async_session_maker
    
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=timeout_minutes)
        
        async with async_session_maker() as session:
            result = await session.execute(
                update(CallSession)
                .where(
                    (CallSession.status == "active") &
                    (CallSession.started_at < cutoff)
                )
                .values(status="abandoned", ended_at=datetime.now(timezone.utc))
            )
            await _safe_commit(session)
            
            cleaned_count = result.rowcount
            if cleaned_count > 0:
                from app.utils.logger import get_logger
                logger = get_logger(__name__)
                logger.info(f"Cleaned up {cleaned_count} stale call session(s)")
                
    except Exception as e:
        from app.utils.logger import get_logger
        logger = get_logger(__name__)
        logger.error(f"Error cleaning up stale sessions: {type(e).__name__}: {str(e)}")