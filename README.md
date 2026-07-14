# CloudOps Lab - Phase 1

This is Phase 1 of the CloudOps Lab platform. It establishes the local development and application foundation using a React frontend and Node.js backend.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Material UI
- **Backend:** Node.js, Express, TypeScript, Mongoose
- **Database:** MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster connection string

### Backend Setup
1. `cd backend`
2. `npm install`
3. Update `.env` file with your `MONGODB_URI` and `JWT_SECRET`.
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### API Documentation
Once the backend is running, you can view the API documentation at:
http://localhost:5000/api/docs
