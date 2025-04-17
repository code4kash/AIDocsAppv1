import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { logger } from './index';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
    redis: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
    memory: {
      status: 'healthy' | 'unhealthy';
      usage: NodeJS.MemoryUsage;
    };
  };
}

export class HealthCheck {
  private dbPool: Pool;
  private redisClient: Redis;

  constructor() {
    this.dbPool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    });

    this.redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  private async checkDatabase(): Promise<{ status: 'healthy' | 'unhealthy'; responseTime: number }> {
    const start = Date.now();
    try {
      await this.dbPool.query('SELECT 1');
      return {
        status: 'healthy',
        responseTime: Date.now() - start
      };
    } catch (error) {
      logger.error('Database health check failed', { error });
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start
      };
    }
  }

  private async checkRedis(): Promise<{ status: 'healthy' | 'unhealthy'; responseTime: number }> {
    const start = Date.now();
    try {
      await this.redisClient.ping();
      return {
        status: 'healthy',
        responseTime: Date.now() - start
      };
    } catch (error) {
      logger.error('Redis health check failed', { error });
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start
      };
    }
  }

  private checkMemory(): { status: 'healthy' | 'unhealthy'; usage: NodeJS.MemoryUsage } {
    const memoryUsage = process.memoryUsage();
    const memoryStatus = memoryUsage.heapUsed / memoryUsage.heapTotal < 0.9 ? 'healthy' : 'unhealthy';
    
    return {
      status: memoryStatus,
      usage: memoryUsage
    };
  }

  public async check(): Promise<HealthStatus> {
    const [dbCheck, redisCheck] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis()
    ]);
    
    const memoryCheck = this.checkMemory();
    
    const checks = {
      database: dbCheck,
      redis: redisCheck,
      memory: memoryCheck
    };
    
    const status = Object.values(checks).every(check => check.status === 'healthy')
      ? 'healthy'
      : Object.values(checks).some(check => check.status === 'unhealthy')
      ? 'unhealthy'
      : 'degraded';
    
    return {
      status,
      timestamp: new Date().toISOString(),
      checks
    };
  }

  public async close() {
    await this.dbPool.end();
    await this.redisClient.quit();
  }
} 