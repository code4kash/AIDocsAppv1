export interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  isPublic: boolean;
  tags: string[];
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentRequest {
  title: string;
  content: string;
  isPublic?: boolean;
  tags?: string[];
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface DocumentResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  isPublic: boolean;
  tags: string[];
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentError {
  code: string;
  message: string;
  field?: string;
} 