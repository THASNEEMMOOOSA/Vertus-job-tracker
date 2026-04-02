# 🚀 Vertus -  Job Tracker & Analytics Platform

A full-stack SaaS-style application designed to help users **track job applications, manage interview pipelines, and gain actionable insights through analytics dashboards**.

Built with a modern **React + FastAPI + PostgreSQL + AWS deployment architecture**, this platform demonstrates end-to-end product development, scalable backend APIs, responsive frontend engineering, and cloud deployment best practices.

---

## 📌 Overview

Vertus is a production-style job application management platform that enables users to:

* Track job applications across different stages
* Manage interview pipelines
* Monitor application trends and status distribution
* View analytics dashboards
* Perform full CRUD operations
* Securely authenticate using JWT
* Access the application via cloud deployment on AWS EC2

This project was built to showcase **full-stack engineering capabilities**, **clean architecture principles**, and **real-world deployment workflows**.

---

## 🏗 Tech Stack

### Frontend

* **React.js**
* **TypeScript**
* **Tailwind CSS**
* **Axios**
* **Recharts**
* **React Router DOM**

### Backend

* **FastAPI**
* **Python**
* **SQLAlchemy**
* **Pydantic**
* **JWT Authentication**
* **PostgreSQL**

### Cloud & DevOps

* **AWS EC2 (Free Tier)**
* **Nginx**
* **systemd service management**
* **GitHub**
* **Linux / Ubuntu**
* **REST APIs**

---

## ✨ Key Features

### 🔐 Authentication & Security

* JWT-based login and registration
* Protected API routes
* Secure password hashing
* Token-based session management

---

### 📋 Job Management

* Add new job applications
* Edit application details
* Delete applications
* Search by company name
* Filter by status
* Status pipeline support:

  * Applied
  * Interview
  * Offer
  * Rejected

---

### 📊 Analytics Dashboard

* Total application count
* Status distribution chart
* Weekly trend chart
* KPI cards
* Dashboard visualizations using Recharts

---

### ☁ Cloud Deployment

* Frontend deployed on **AWS EC2 + Nginx**
* Backend served via **Uvicorn + systemd**
* PostgreSQL database integration
* Production-style Linux service deployment

---

## 📸 Application Screenshots

### Dashboard

*Add your screenshot here*

```md
![Dashboard Screenshot](https://github.com/THASNEEMMOOOSA/Vertus-job-tracker/blob/main/screenshots/front1.png)
![Dashboard Screenshot](https://github.com/THASNEEMMOOOSA/Vertus-job-tracker/blob/main/screenshots/front2.png)
![Dashboard Screenshot](https://github.com/THASNEEMMOOOSA/Vertus-job-tracker/blob/main/screenshots/front3.png)

```

---

## 📁 Project Structure

```text
vertus-job-tracker/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── core/
│
└── README.md
```

---

## 🚀 API Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
```

### Jobs

```http
GET    /jobs
POST   /jobs
PUT    /jobs/{id}
DELETE /jobs/{id}
```

### Analytics

```http
GET /jobs/analytics/summary
```

---

## 🛠 Local Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/Vertus-job-tracker.git
cd smart-job-tracker
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## ☁ AWS Deployment Highlights

This application is deployed using **AWS Free Tier EC2 Ubuntu instance**.

Deployment includes:

* Linux server provisioning
* Nginx reverse proxy
* FastAPI service via `systemd`
* PostgreSQL integration
* frontend static asset hosting

This project demonstrates hands-on experience in:

* cloud deployment
* server configuration
* production application hosting
* service reliability

---

## 🎯 Why This Project

This project was built to demonstrate:

* full-stack application development
* scalable REST API design
* frontend architecture and state management
* data visualization
* cloud deployment workflows
* production-style software engineering practices

---

## 👨‍💻 Author

**Your Name**
Full Stack Developer | React | FastAPI | Python | AWS | PostgreSQL

LinkedIn: *add your profile link*
Portfolio: *add your portfolio link*

---
