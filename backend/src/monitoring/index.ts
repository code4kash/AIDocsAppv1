import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';
import { performance } from 'perf_hooks';
import { MetricsCollector } from './metrics';
import { ErrorTracker } from './errorTracker';
import { HealthCheck } from './healthCheck';

// Initialize Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Initialize metrics collector
const metrics = new MetricsCollector();

// Initialize error tracker
const errorTracker = new ErrorTracker();

// Initialize health check
const healthCheck = new HealthCheck();

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    const { method, url, ip } = req;
    const { statusCode } = res;
    
    logger.info('Request completed', {
      method,
      url,
      ip,
      statusCode,
      duration: `${duration.toFixed(2)}ms`
    });
    
    metrics.recordRequest(method, url, statusCode, duration);
  });
  
  next();
};

// Error tracking middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  errorTracker.captureError(err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
};

// Health check endpoint
export const healthCheckHandler = async (req: Request, res: Response) => {
  const status = await healthCheck.check();
  res.json(status);
};

// Metrics endpoint
export const metricsHandler = (req: Request, res: Response) => {
  res.json(metrics.getMetrics());
};

export { logger, metrics, errorTracker, healthCheck }; 