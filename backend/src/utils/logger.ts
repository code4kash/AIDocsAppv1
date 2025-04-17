import { createLogger, format, transports } from 'winston';
import { env } from '../config/env';

const { combine, timestamp, json, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = createLogger({
  level: env.logLevel || 'info',
  format: combine(
    timestamp(),
    env.nodeEnv === 'development' ? combine(colorize(), logFormat) : json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: 'logs/exceptions.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  rejectionHandlers: [
    new transports.File({ 
      filename: 'logs/rejections.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

export { logger }; 