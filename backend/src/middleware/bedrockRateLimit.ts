import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Redis } from 'ioredis';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'bedrock_rate_limit',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60 * 5, // Block for 5 minutes if limit exceeded
});

export const bedrockRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const key = `user:${req.user.id}`;
    await rateLimiter.consume(key);
    next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Rate limit error:', error);
      if (error.message.includes('Rate limit exceeded')) {
        return next(new AppError('Too many requests. Please try again later.', 429));
      }
    }
    next(error);
  }
}; 