import { Request, Response } from 'express';
import { documentService } from '../services/documentService';
import { NotFoundError, ValidationError } from '../utils/errors';

export class DocumentController {
  async createDocument(req: Request, res: Response) {
    try {
      const { title, content, isPublic } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const document = await documentService.createDocument({
        title,
        content,
        isPublic,
        userId
      });

      res.status(201).json(document);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create document' });
      }
    }
  }

  async getDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const document = await documentService.getDocumentById(id);
      
      if (!document) {
        throw new NotFoundError('Document not found');
      }

      // Check if user has access to the document
      if (!document.isPublic && document.userId !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to get document' });
      }
    }
  }

  async updateDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content, isPublic } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const document = await documentService.getDocumentById(id);
      
      if (!document) {
        throw new NotFoundError('Document not found');
      }

      // Check if user owns the document
      if (document.userId !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const updatedDocument = await documentService.updateDocument(id, {
        title,
        content,
        isPublic
      });

      res.json(updatedDocument);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update document' });
      }
    }
  }

  async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const document = await documentService.getDocumentById(id);
      
      if (!document) {
        throw new NotFoundError('Document not found');
      }

      // Check if user owns the document
      if (document.userId !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      await documentService.deleteDocument(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete document' });
      }
    }
  }

  async listDocuments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 10, search } = req.query;

      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const documents = await documentService.listDocuments(userId, {
        page: Number(page),
        limit: Number(limit),
        search: search as string
      });

      res.json(documents);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to list documents' });
      }
    }
  }

  async listPublicDocuments(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;

      const documents = await documentService.listPublicDocuments({
        page: Number(page),
        limit: Number(limit),
        search: search as string
      });

      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list public documents' });
    }
  }
}

export const documentController = new DocumentController(); 