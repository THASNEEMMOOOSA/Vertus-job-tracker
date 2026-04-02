from fastapi import FastAPI
from app.api.routes import auth
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Job Tracker API")

app.include_router(auth.router)
from app.api.routes import auth, jobs

app.include_router(auth.router)
app.include_router(jobs.router)

@app.get("/")
def root():
    return {"message": "API running successfully"}