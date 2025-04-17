import express from 'express';
import { authenticate } from '../middleware/auth';
import { DocumentModel } from '../models/document';
import { AppError } from '../middleware/error';

const router = express.Router();

// Create document
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, content, isPublic } = req.body;
    const userId = req.user!.id;

    const document = await DocumentModel.create({
      title,
      content,
      user_id: userId,
      is_public: isPublic || false,
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
});

// Get document by ID
router.get('/:id', async (req, res, next) => {
  try {
    const document = await DocumentModel.findById(req.params.id);
    if (!document) {
      throw new AppError(404, 'Document not found');
    }

    // Check if document is public or user is the owner
    if (!document.is_public && (!req.user || document.user_id !== req.user.id)) {
      throw new AppError(403, 'Access denied');
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
});

// Update document
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { title, content, isPublic } = req.body;
    const documentId = req.params.id;
    const userId = req.user!.id;

    // Check if document exists and user is the owner
    const existingDocument = await DocumentModel.findById(documentId);
    if (!existingDocument) {
      throw new AppError(404, 'Document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new AppError(403, 'Access denied');
    }

    const updatedDocument = await DocumentModel.update(documentId, {
      title,
      content,
      is_public: isPublic,
    });

    res.json(updatedDocument);
  } catch (error) {
    next(error);
  }
});

// Delete document
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const userId = req.user!.id;

    // Check if document exists and user is the owner
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      throw new AppError(404, 'Document not found');
    }

    if (document.user_id !== userId) {
      throw new AppError(403, 'Access denied');
    }

    await DocumentModel.delete(documentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// List user's documents
router.get('/user/:userId', authenticate, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Check if user is requesting their own documents
    if (userId !== req.user!.id) {
      throw new AppError(403, 'Access denied');
    }

    const documents = await DocumentModel.listDocuments(userId, page, limit);
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

// List public documents
router.get('/public', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const documents = await DocumentModel.listPublicDocuments(page, limit);
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

// Search documents
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      throw new AppError(400, 'Search query is required');
    }

    const documents = await DocumentModel.searchDocuments(
      q as string,
      req.user?.id
    );
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

export default router; 