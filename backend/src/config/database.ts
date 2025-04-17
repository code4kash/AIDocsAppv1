import { Pool } from 'pg';
import logger from './logger';
import config from './config';

const pool = new Pool(config.database);

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const connectDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info('Database connection verified');
    return pool;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await pool.end();
    logger.info('Disconnected from PostgreSQL database');
  } catch (error) {
    logger.error('Error disconnecting from PostgreSQL:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export { pool }; 