from fastapi import FastAPI
from app.core.database import Base, engine

from app.models.user import User
from app.models.job import Job  # force import all models
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Job Tracker API")

from app.api.routes import auth, jobs

app.include_router(auth.router)
app.include_router(jobs.router)

from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://localhost:5173",  # React app
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],  # IMPORTANT
    allow_headers=["*"],  # IMPORTANT
)

@app.get("/")
def root():
    return {"message": "API running successfully"}