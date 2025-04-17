import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errorHandler';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class AIService {
  private static readonly MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-v2';

  static async generateResponse(prompt: string, context?: string) {
    try {
      const input = {
        modelId: this.MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: context ? `${context}\n\n${prompt}` : prompt,
          max_tokens_to_sample: 1000,
          temperature: 0.7,
          top_p: 0.9,
        }),
      };

      const command = new InvokeModelCommand(input);
      const response = await bedrockClient.send(command);
      
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.completion;
    } catch (error) {
      logger.error('Error in generateResponse:', error);
      throw new AppError('Failed to generate AI response', 500);
    }
  }

  static async analyzeDocument(content: string) {
    try {
      const prompt = `Please analyze the following document and provide a summary of its key points:\n\n${content}`;
      return await this.generateResponse(prompt);
    } catch (error) {
      logger.error('Error in analyzeDocument:', error);
      throw new AppError('Failed to analyze document', 500);
    }
  }

  static async generateDocumentSummary(content: string) {
    try {
      const prompt = `Please provide a concise summary of the following document:\n\n${content}`;
      return await this.generateResponse(prompt);
    } catch (error) {
      logger.error('Error in generateDocumentSummary:', error);
      throw new AppError('Failed to generate document summary', 500);
    }
  }
} 