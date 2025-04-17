import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

export class SessionManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async createSession(userId: string, token: string): Promise<void> {
    const key = `session:${userId}:${token}`;
    await this.redis.setex(key, SESSION_TTL, 'active');
  }

  async validateSession(userId: string, token: string): Promise<boolean> {
    const key = `session:${userId}:${token}`;
    const exists = await this.redis.exists(key);
    return exists === 1;
  }

  async invalidateSession(userId: string, token: string): Promise<void> {
    const key = `session:${userId}:${token}`;
    await this.redis.del(key);
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    const pattern = `session:${userId}:*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

export const sessionManager = new SessionManager();

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const isValid = await sessionManager.validateSession(req.user.id, token);
    if (!isValid) {
      return next(new AppError('Session expired', 401));
    }

    // Refresh session TTL
    await sessionManager.createSession(req.user.id, token);
    next();
  } catch (error) {
    logger.error('Session validation error:', error);
    next(new AppError('Session validation failed', 500));
  }
}; 