import { Router } from 'express';
import { DocumentService } from '../services/documentService';
import { authenticate } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

const router = Router();
const documentService = new DocumentService();

// Get all documents for the authenticated user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const documents = await documentService.listDocuments(req.user.id);
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

// Get all public documents
router.get('/public', async (req, res, next) => {
  try {
    const documents = await documentService.listPublicDocuments();
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

// Get a specific document
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(req.params.id, req.user.id);
    res.json(document);
  } catch (error) {
    next(error);
  }
});

// Create a new document
router.post('/', authenticate, async (req, res, next) => {
  try {
    const document = await documentService.createDocument({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
});

// Update a document
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const document = await documentService.updateDocument(req.params.id, req.body, req.user.id);
    res.json(document);
  } catch (error) {
    next(error);
  }
});

// Delete a document
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router; 