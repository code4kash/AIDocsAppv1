import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';
import { sessionMiddleware } from './middleware/session';
import { dataIsolationMiddleware } from './middleware/dataIsolation';
import { bedrockRateLimitMiddleware } from './middleware/bedrockRateLimit';
import { logger } from './utils/logger';
import './db/connection'; // Initialize database connection

// Import routes
import documentRoutes from './routes/document';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and authentication middleware
app.use(sessionMiddleware);
app.use(authenticate);

// Data isolation middleware
app.use(dataIsolationMiddleware);

// Rate limiting for Bedrock API calls
app.use('/api/documents/analyze', bedrockRateLimitMiddleware);
app.use('/api/documents/summarize', bedrockRateLimitMiddleware);

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

export default app; 