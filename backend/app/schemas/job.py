from pydantic import BaseModel
from datetime import date
from typing import Optional


class JobCreate(BaseModel):
    company_name: str
    role: str
    location: Optional[str] = None
    status: Optional[str] = "Applied"
    source: Optional[str] = None
    notes: Optional[str] = None
    applied_date: date


class JobResponse(JobCreate):
    id: int

    class Config:
        orm_mode = True