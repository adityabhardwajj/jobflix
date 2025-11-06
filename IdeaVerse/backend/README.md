# IdeaVerse Backend

Backend API for the IdeaVerse innovation and freelance collaboration platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file and add your MongoDB connection string:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=ideaverse_secret
```

3. Run the server:
```bash
npm run server
```

## Tech Stack

- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

