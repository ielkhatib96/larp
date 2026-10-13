"""
LARP back end: the entry point.

This file creates the FastAPI "app" object and lists the API routes.
Run it from the backend folder with:
    uvicorn app.main:app --reload
Then open http://localhost:8000/docs to see and try every route.
"""

from fastapi import FastAPI

# The app object. Every route below is attached to it.
app = FastAPI(title="LARP API", version="0.1.0")


@app.get("/api/health")
def health():
    """A tiny check the front end calls to see whether the back end is running."""
    return {"status": "ok"}
