"""
One command to wipe the database and reload all the seed data.

Run it from the backend folder:
    .venv\Scripts\python -m app.reset_db

WARNING: this deletes larp.db, including any accounts created by hand.
Stop the server first (Windows will not let us delete the file while it is open).
"""

from sqlmodel import Session

from app.database import DB_FILE, create_db_and_tables, engine
from app.match_cache import rebuild_match_cache
from app.seed_events import load_test_events, load_test_venues
from app.seed_profiles import SEED_PASSWORD, load_profiles
from app.seed_tags import load_tags


def reset_db():
    """Delete the database, rebuild the tables, load tags and students."""
    engine.dispose()  # let go of any open connection to the file
    if DB_FILE.exists():
        DB_FILE.unlink()

    create_db_and_tables()
    with Session(engine) as session:
        tags = load_tags(session)
        students = load_profiles(session)
        matches = rebuild_match_cache(session)
        events = load_test_events(session)
        venues = load_test_venues(session)

    print(f"Database reset: {tags} tags, {students} students (including 2 demo accounts) loaded.")
    print(f"Loaded {events} INVENTED test events and {venues} invented test venues (real ones come in Step 6).")
    print(f"Saved {matches} match-list rows (each student's top 20).")
    print(f"Every seed account uses the password: {SEED_PASSWORD}")
    print("Demo logins: demo.main@ucl.ac.uk (main campus, career) and demo.canary@ucl.ac.uk (Canary Wharf, social)")


if __name__ == "__main__":
    reset_db()
