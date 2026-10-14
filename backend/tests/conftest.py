"""Shared test set-up: a throw-away in-memory database, never larp.db."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.database import get_session
from app.main import app
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
