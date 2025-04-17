import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().default(3000),
  jwtSecret: z.string().min(32),
  databaseUrl: z.string().url(),
  redisHost: z.string().default('localhost'),
  redisPort: z.number().default(6379),
  sessionSecret: z.string().min(32),
  corsOrigin: z.string().default('*'),
  apiUrl: z.string().url(),
  smtpHost: z.string(),
  smtpPort: z.number(),
  smtpUser: z.string(),
  smtpPass: z.string(),
  awsAccessKeyId: z.string(),
  awsSecretAccessKey: z.string(),
  awsRegion: z.string(),
  awsBucketName: z.string(),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  openaiApiKey: z.string().optional(),
});

const env = envSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  sessionSecret: process.env.SESSION_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
  apiUrl: process.env.API_URL,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  awsBucketName: process.env.AWS_BUCKET_NAME,
  logLevel: process.env.LOG_LEVEL,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export { env }; 