# IdeaVerse 🌌

**Where Ideas Meet Opportunity.**

An innovation and freelance collaboration platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🏗️ Project Structure

```
IdeaVerse/
├── backend/          # Express.js API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── utils/        # Utility functions
│   └── server.js     # Entry point
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Utility functions
│   └── ...
└── package.json      # Root package.json for running both servers
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
```bash
cd IdeaVerse
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Install backend dependencies:**
```bash
cd backend
npm install
```

4. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

5. **Configure environment variables:**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=ideaverse_secret
   ```

### Running the Application

**Option 1: Run both servers concurrently (Recommended)**

From the root directory:
```bash
npm start
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server (usually on `http://localhost:5173`)

**Option 2: Run servers separately**

Backend:
```bash
cd backend
npm run server
```

Frontend:
```bash
cd frontend
npm run dev
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Axios** - HTTP client

## 📝 Development

### Backend API

The backend API is available at `http://localhost:5000`. The base route returns:
```json
"IdeaVerse API is running..."
```

### Frontend

The frontend React application runs on the default Vite port (usually `http://localhost:5173`).

## 🎯 Next Steps

- Set up MongoDB connection
- Implement user authentication
- Create API routes for ideas and projects
- Build React components for the UI
- Add routing and navigation
- Implement state management

## 📄 License

ISC

