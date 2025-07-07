import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import resumeRoutes from './routes/resumes';
import interviewRoutes from './routes/interviews';
import notificationRoutes from './routes/notifications';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authMiddleware } from './middleware/auth';

// Import database connection
import { connectDB } from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Jobflix API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API Routes
const apiVersion = process.env.API_VERSION || 'v1';
const apiPrefix = `/api/${apiVersion}`;

// Public routes
app.use(`${apiPrefix}/auth`, authRoutes);

// Protected routes
app.use(`${apiPrefix}/users`, authMiddleware, userRoutes);
app.use(`${apiPrefix}/jobs`, jobRoutes);
app.use(`${apiPrefix}/applications`, authMiddleware, applicationRoutes);
app.use(`${apiPrefix}/resumes`, authMiddleware, resumeRoutes);
app.use(`${apiPrefix}/interviews`, authMiddleware, interviewRoutes);
app.use(`${apiPrefix}/notifications`, authMiddleware, notificationRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userId: string) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully');

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}${apiPrefix}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

startServer(); 