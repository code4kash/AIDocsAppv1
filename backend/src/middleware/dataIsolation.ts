import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const dataIsolationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    // Add user context to request
    req.userContext = {
      userId: req.user.id,
      role: req.user.role,
      email: req.user.email
    };

    // For document operations, ensure user owns the document
    if (req.params.documentId) {
      const document = await DocumentModel.findById(req.params.documentId);
      if (!document) {
        return next(new AppError('Document not found', 404));
      }
      if (document.user_id !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Unauthorized access to document', 403));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}; 