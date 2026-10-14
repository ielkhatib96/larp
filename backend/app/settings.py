"""
Settings read from the .env file in the project root (never committed).

If .env is missing we fall back to obviously-fake values, so the app and the
tests still run. Copy .env.example to .env and put a real JWT_SECRET in it.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# .env sits in the project root, one level above backend/.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

# Secret used to sign login tokens. Anyone who knows it can forge a login.
JWT_SECRET = os.getenv("JWT_SECRET", "dev-only-secret-change-me-this-is-not-secure")

# Key for the /api/admin/* routes (used from Step 6).
ADMIN_KEY = os.getenv("ADMIN_KEY", "dev-only-admin-key")

# true = no live scraping and no live Claude calls.
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

# How long a login token stays valid.
TOKEN_HOURS = 24
