export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export interface RedisConfig {
  url: string;
  ttl: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface SessionConfig {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {
    secure: boolean;
    maxAge: number;
  };
}

export interface SecurityConfig {
  cors: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
    maxAge: number;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

export interface LoggingConfig {
  level: string;
  format: string;
  transports: string[];
}

export interface AppConfig {
  env: string;
  port: number;
  apiPrefix: string;
  database: DatabaseConfig;
  redis: RedisConfig;
  jwt: JwtConfig;
  session: SessionConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
} 