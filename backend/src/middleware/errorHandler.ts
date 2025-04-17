import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Default error
  return res.status(500).json({
    error: 'Internal server error'
  });
}; 