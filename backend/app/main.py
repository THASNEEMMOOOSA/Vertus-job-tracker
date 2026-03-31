from fastapi import FastAPI
from app.api.routes import auth
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Job Tracker API")

app.include_router(auth.router)


@app.get("/")
def root():
    return {"message": "API running successfully"}