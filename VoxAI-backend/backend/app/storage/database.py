import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool

# Use SQLite with aiosqlite for async support
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///voxai.db")

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    future=True,
    poolclass=NullPool,  # SQLite doesn't support connection pooling well
)

# Create async session maker
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_async_session() -> AsyncSession:
    """
    FastAPI dependency to get async session.
    Usage in endpoint:
        async def endpoint(session: AsyncSession = Depends(get_async_session)):
            ...
    """
    async with async_session_maker() as session:
        yield session


async def init_db():
    """Initialize database tables."""
    from app.storage.models import Base
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Close database connection."""
    await engine.dispose()
