import { config as dotenvConfig } from 'dotenv';
import { AppConfig, DatabaseConfig, RedisConfig, JwtConfig, SessionConfig, SecurityConfig, LoggingConfig } from './types';

// Load environment variables
dotenvConfig();

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
};

const databaseConfig: DatabaseConfig = {
  host: getEnvVar('POSTGRES_HOST', 'localhost'),
  port: parseInt(getEnvVar('POSTGRES_PORT', '5432'), 10),
  user: getEnvVar('POSTGRES_USER', 'postgres'),
  password: getEnvVar('POSTGRES_PASSWORD', 'postgres'),
  database: getEnvVar('POSTGRES_DB', 'aidocs_assistant'),
  max: parseInt(getEnvVar('POSTGRES_MAX_CONNECTIONS', '20'), 10),
  idleTimeoutMillis: parseInt(getEnvVar('POSTGRES_IDLE_TIMEOUT', '30000'), 10),
  connectionTimeoutMillis: parseInt(getEnvVar('POSTGRES_CONNECTION_TIMEOUT', '2000'), 10),
};

const redisConfig: RedisConfig = {
  url: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
  ttl: parseInt(getEnvVar('REDIS_TTL', '86400'), 10), // 24 hours
};

const jwtConfig: JwtConfig = {
  secret: getEnvVar('JWT_SECRET'),
  expiresIn: getEnvVar('JWT_EXPIRES_IN', '1h'),
  refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
};

const sessionConfig: SessionConfig = {
  secret: getEnvVar('SESSION_SECRET'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: getEnvVar('NODE_ENV', 'development') === 'production',
    maxAge: parseInt(getEnvVar('SESSION_MAX_AGE', '86400000'), 10), // 24 hours
  },
};

const securityConfig: SecurityConfig = {
  cors: {
    origin: getEnvVar('CORS_ORIGIN', '*').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
  rateLimit: {
    windowMs: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10), // 15 minutes
    max: parseInt(getEnvVar('RATE_LIMIT_MAX', '100'), 10),
  },
};

const loggingConfig: LoggingConfig = {
  level: getEnvVar('LOG_LEVEL', 'info'),
  format: getEnvVar('LOG_FORMAT', 'json'),
  transports: getEnvVar('LOG_TRANSPORTS', 'console,file').split(','),
};

const config: AppConfig = {
  env: getEnvVar('NODE_ENV', 'development'),
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  apiPrefix: getEnvVar('API_PREFIX', '/api/v1'),
  database: databaseConfig,
  redis: redisConfig,
  jwt: jwtConfig,
  session: sessionConfig,
  security: securityConfig,
  logging: loggingConfig,
};

export default config; 