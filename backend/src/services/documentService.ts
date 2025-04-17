import { Document, DocumentDocument } from '../models/Document';
import { DocumentCreateInput, DocumentUpdateInput, DocumentListResponse } from '../types/document';
import { NotFoundError } from '../utils/errors';

export class DocumentService {
  static async createDocument(input: DocumentCreateInput, userId: string): Promise<DocumentDocument> {
    const document = new Document({
      ...input,
      userId,
    });
    return await document.save();
  }

  static async getDocumentById(id: string, userId: string): Promise<DocumentDocument> {
    const document = await Document.findOne({
      _id: id,
      $or: [{ userId }, { isPublic: true }],
    });

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    return document;
  }

  static async updateDocument(
    id: string,
    input: DocumentUpdateInput,
    userId: string
  ): Promise<DocumentDocument> {
    const document = await Document.findOneAndUpdate(
      { _id: id, userId },
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    return document;
  }

  static async deleteDocument(id: string, userId: string): Promise<void> {
    const result = await Document.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      throw new NotFoundError('Document not found');
    }
  }

  static async listDocuments(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<DocumentListResponse> {
    const query: any = { userId };
    
    if (search) {
      query.$text = { $search: search };
    }

    const [documents, total] = await Promise.all([
      Document.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Document.countDocuments(query),
    ]);

    return {
      documents,
      total,
      page,
      limit,
    };
  }

  static async listPublicDocuments(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<DocumentListResponse> {
    const query: any = { isPublic: true };
    
    if (search) {
      query.$text = { $search: search };
    }

    const [documents, total] = await Promise.all([
      Document.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Document.countDocuments(query),
    ]);

    return {
      documents,
      total,
      page,
      limit,
    };
  }
} 