import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';
import { Document as DocumentType } from '../types/document';

export interface DocumentDocument extends DocumentType, MongooseDocument {}

const documentSchema = new Schema<DocumentDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for searching documents
documentSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Index for user's documents
documentSchema.index({ userId: 1, createdAt: -1 });

export const Document = mongoose.model<DocumentDocument>('Document', documentSchema); 