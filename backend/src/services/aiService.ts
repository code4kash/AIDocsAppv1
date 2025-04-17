import { Document } from '../models/document';
import { query } from '../db/connection';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';
import { Configuration, OpenAIApi } from 'openai';

class AIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async analyzeDocument(documentId: string, userId: string): Promise<any> {
    try {
      // Get document content
      const result = await query(
        'SELECT content, file_url FROM documents WHERE id = $1 AND user_id = $2',
        [documentId, userId]
      );

      if (result.rows.length === 0) {
        throw new AppError('Document not found', 404);
      }

      const document = result.rows[0];

      // Analyze document using OpenAI
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a document analysis assistant. Analyze the following document and provide a summary, key points, and any important insights."
          },
          {
            role: "user",
            content: document.content
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      // Save analysis results
      await query(
        'UPDATE documents SET ai_analysis = $1, analyzed_at = NOW() WHERE id = $2',
        [response.data.choices[0].message?.content, documentId]
      );

      return {
        summary: response.data.choices[0].message?.content,
        documentId,
        analyzedAt: new Date()
      };
    } catch (error) {
      logger.error('Error analyzing document:', error);
      throw new AppError('Failed to analyze document', 500);
    }
  }

  async generateDocumentSummary(documentId: string, userId: string): Promise<string> {
    try {
      const result = await query(
        'SELECT content FROM documents WHERE id = $1 AND user_id = $2',
        [documentId, userId]
      );

      if (result.rows.length === 0) {
        throw new AppError('Document not found', 404);
      }

      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a document summarization assistant. Create a concise summary of the following document."
          },
          {
            role: "user",
            content: result.rows[0].content
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      return response.data.choices[0].message?.content || '';
    } catch (error) {
      logger.error('Error generating document summary:', error);
      throw new AppError('Failed to generate document summary', 500);
    }
  }

  async answerQuestion(documentId: string, userId: string, question: string): Promise<string> {
    try {
      const result = await query(
        'SELECT content FROM documents WHERE id = $1 AND user_id = $2',
        [documentId, userId]
      );

      if (result.rows.length === 0) {
        throw new AppError('Document not found', 404);
      }

      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a document Q&A assistant. Answer the following question based on the document content."
          },
          {
            role: "user",
            content: `Document content: ${result.rows[0].content}\n\nQuestion: ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.data.choices[0].message?.content || '';
    } catch (error) {
      logger.error('Error answering question:', error);
      throw new AppError('Failed to answer question', 500);
    }
  }
}

export const aiService = new AIService(); 