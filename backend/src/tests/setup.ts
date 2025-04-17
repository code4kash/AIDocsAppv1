import { Pool } from 'pg';
import { redis } from '../config/redis';
import { env } from '../config/env';

const testPool = new Pool({
  connectionString: env.databaseUrl,
});

beforeAll(async () => {
  // Create test database if it doesn't exist
  await testPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      is_email_verified BOOLEAN DEFAULT false,
      reset_password_token VARCHAR(255),
      reset_password_expires TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      is_public BOOLEAN DEFAULT false,
      user_id UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

afterAll(async () => {
  // Clean up test database
  await testPool.query(`
    DROP TABLE IF EXISTS documents;
    DROP TABLE IF EXISTS users;
  `);
  await testPool.end();
  await redis.quit();
});

export { testPool }; 