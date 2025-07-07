import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
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
    environment: NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes
const apiVersion = process.env.API_VERSION || 'v1';
const apiPrefix = `/api/${apiVersion}`;

// Public routes
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/jobs`, jobRoutes);

// Placeholder routes for other features
app.get(`${apiPrefix}/users`, (req, res) => {
  res.json({ message: 'Users route - to be implemented' });
});

app.get(`${apiPrefix}/applications`, (req, res) => {
  res.json({ message: 'Applications route - to be implemented' });
});

app.get(`${apiPrefix}/resumes`, (req, res) => {
  res.json({ message: 'Resumes route - to be implemented' });
});

app.get(`${apiPrefix}/interviews`, (req, res) => {
  res.json({ message: 'Interviews route - to be implemented' });
});

app.get(`${apiPrefix}/notifications`, (req, res) => {
  res.json({ message: 'Notifications route - to be implemented' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}${apiPrefix}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 Available endpoints:`);
      console.log(`   - GET /health`);
      console.log(`   - POST ${apiPrefix}/auth/register`);
      console.log(`   - POST ${apiPrefix}/auth/login`);
      console.log(`   - GET ${apiPrefix}/jobs`);
      console.log(`   - GET ${apiPrefix}/jobs/:id`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer(); 