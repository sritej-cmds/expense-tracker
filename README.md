# Expense Tracker

Expense Tracker is a full-stack web application that helps users manage shared expenses within groups. It allows users to create groups, add members, record expenses, split bills, track balances, and settle payments. The project was built as a collaborative learning experience to explore modern full-stack development, authentication, databases, deployment, and GitHub collaboration.

## Live Demo

Frontend: https://expense-tracker-rho-peach-77.vercel.app/

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- React Router

### Backend
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Pydantic
- JWT Authentication
- Passlib (bcrypt)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL

---

## Features

### Authentication
- User Registration
- Secure Login
- JWT Authentication
- Password Hashing
- Protected Routes

### Groups
- Create Groups
- Search Users
- Add Members
- View Group Details
- List User Groups

### Expenses
- Add Expenses
- Split Expenses Among Members
- Track Individual Balances
- View Expense History

### Settlements
- Record Payments
- Settle Outstanding Balances
- Support for Decimal (Paise) Transactions

---

## Project Structure

```
expense-tracker/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## Architecture

The backend follows an MVC architecture.

```
Client
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
PostgreSQL
```

---

## Authentication Flow

```
Register
      │
      ▼
Hash Password
      │
      ▼
Store User
      │
      ▼
Login
      │
      ▼
Verify Password
      │
      ▼
Generate JWT
      │
      ▼
Access Protected APIs
```

---

## Local Setup

### Clone the Repository

```bash
git clone https://github.com/likixv2/expense-tracker.git
cd expense-tracker
```

### Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# Windows:
# .venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/expense_tracker

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Git Workflow

```
Create Feature Branch
        │
        ▼
Develop Feature
        │
        ▼
Commit Changes
        │
        ▼
Push Branch
        │
        ▼
Open Pull Request
        │
        ▼
Review
        │
        ▼
Merge into Main
```

---

## Contributors

| Name | Contribution |
|------|--------------|
| Sritej Huliyapur | Backend (Authentication, Groups, Database) |
| Likith | Frontend Development |
| Team Member | Expenses, Settlements and Additional Features |

---

## Learning Objectives

This project was built to gain practical experience with:

- React
- FastAPI
- PostgreSQL
- SQLAlchemy
- REST APIs
- JWT Authentication
- MVC Architecture
- Git & GitHub Collaboration
- Full-Stack Deployment

---

## Future Improvements

- Email Verification
- User Profiles
- Expense Categories
- Recurring Expenses
- Notifications
- Analytics Dashboard
- Dark Mode
- Mobile Responsive Interface

---

## License

This project is intended for educational and learning purposes.
