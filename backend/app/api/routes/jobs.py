from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.job import Job
from app.schemas.job import JobCreate, JobResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_job = Job(**job.dict(), user_id=current_user.id)

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job

@router.get("/", response_model=list[JobResponse])
def get_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Job).filter(Job.user_id == current_user.id).all()

@router.put("/{job_id}")
def update_job(
    job_id: int,
    updated_job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    for key, value in updated_job.dict().items():
        setattr(job, key, value)

    db.commit()

    return {"message": "Job updated successfully"}

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}

@router.get("/analytics/summary")
def job_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_jobs = db.query(Job).filter(
        Job.user_id == current_user.id
    ).count()

    status_counts = (
        db.query(Job.status, func.count(Job.id))
        .filter(Job.user_id == current_user.id)
        .group_by(Job.status)
        .all()
    )

    return {
        "total_jobs": total_jobs,
        "status_breakdown": dict(status_counts)
    }