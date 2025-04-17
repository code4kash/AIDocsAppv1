import { IAIService } from './interfaces/IAIService';
import { BedrockAIService } from './BedrockAIService';
import { logger } from '../utils/logger';

export class AIServiceFactory {
  private static instance: IAIService;

  public static async getAIService(): Promise<IAIService> {
    if (!AIServiceFactory.instance) {
      try {
        AIServiceFactory.instance = await BedrockAIService.getInstance();
        logger.info('AI Service initialized with AWS Bedrock');
      } catch (error) {
        logger.error('Failed to initialize AI Service:', error);
        throw error;
      }
    }
    return AIServiceFactory.instance;
  }
} 