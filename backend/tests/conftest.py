"""Shared test set-up: a throw-away in-memory database, never larp.db."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.database import get_session
from app.main import app
from app.match_cache import rebuild_match_cache
from app.seed_profiles import SEED_PASSWORD, load_profiles
from app.seed_tags import load_tags


@pytest.fixture
def session():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        load_tags(session)  # most tests need the tag list to exist
        yield session


@pytest.fixture
def client(session):
    # Make the routes use the test database instead of larp.db.
    app.dependency_overrides[get_session] = lambda: session
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def seeded(session):
    """The 32 seed students, with their match lists saved (like after reset_db)."""
    load_profiles(session)
    rebuild_match_cache(session)


@pytest.fixture
def login(client):
    """login("demo.main@ucl.ac.uk") gives the header that proves who you are."""

    def do_login(email, password=SEED_PASSWORD):
        token = client.post("/api/login", json={"ucl_email": email, "password": password}).json()["token"]
        return {"Authorization": f"Bearer {token}"}

    return do_login
