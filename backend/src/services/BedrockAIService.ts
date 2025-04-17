import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { IAIService, DocumentAnalysis, DocumentInfo } from "./interfaces/IAIService";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { logger } from "../utils/logger";

interface AIServiceConfig {
  provider: string;
  model_id: string;
  region: string;
}

export class BedrockAIService implements IAIService {
  private bedrock: BedrockRuntimeClient;
  private modelId: string;
  private static instance: BedrockAIService;

  private constructor(config: AIServiceConfig) {
    this.bedrock = new BedrockRuntimeClient({ region: config.region });
    this.modelId = config.model_id;
  }

  public static async getInstance(): Promise<BedrockAIService> {
    if (!BedrockAIService.instance) {
      const config = await BedrockAIService.loadConfig();
      BedrockAIService.instance = new BedrockAIService(config);
    }
    return BedrockAIService.instance;
  }

  private static async loadConfig(): Promise<AIServiceConfig> {
    const secretsManager = new SecretsManager({
      region: process.env.AWS_REGION
    });

    try {
      const secretResponse = await secretsManager.getSecretValue({
        SecretId: `${process.env.PROJECT_NAME}-ai-service-config`
      });

      if (!secretResponse.SecretString) {
        throw new Error("AI service configuration not found");
      }

      return JSON.parse(secretResponse.SecretString) as AIServiceConfig;
    } catch (error) {
      logger.error("Error loading AI service configuration:", error);
      throw error;
    }
  }

  private async invokeModel(prompt: string): Promise<string> {
    const command = new InvokeModelCommand({
      modelId: this.modelId,
      body: JSON.stringify({
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: 4096,
        temperature: 0.7,
        top_p: 0.9,
      }),
      contentType: "application/json",
      accept: "application/json",
    });

    try {
      const response = await this.bedrock.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.completion;
    } catch (error) {
      logger.error("Error invoking Bedrock model:", error);
      throw error;
    }
  }

  async analyzeDocument(documentText: string): Promise<DocumentAnalysis> {
    const prompt = `
      Analyze the following document and provide:
      1. A concise summary
      2. Key points
      3. Overall sentiment (positive, negative, or neutral)
      4. Main topics discussed
      5. Recommendations based on the content

      Document:
      ${documentText}

      Provide the response in JSON format with the following structure:
      {
        "summary": "string",
        "keyPoints": ["string"],
        "sentiment": "string",
        "topics": ["string"],
        "recommendations": ["string"]
      }
    `;

    try {
      const response = await this.invokeModel(prompt);
      return JSON.parse(response) as DocumentAnalysis;
    } catch (error) {
      logger.error("Error analyzing document:", error);
      throw error;
    }
  }

  async generateSummary(documentText: string): Promise<string> {
    const prompt = `
      Generate a concise summary of the following document:

      ${documentText}

      The summary should be clear, informative, and capture the main points while maintaining readability.
    `;

    try {
      return await this.invokeModel(prompt);
    } catch (error) {
      logger.error("Error generating summary:", error);
      throw error;
    }
  }

  async extractInformation(documentText: string): Promise<DocumentInfo> {
    const prompt = `
      Extract the following information from the document:
      - Title (if present)
      - Author (if present)
      - Date (if present)
      - Keywords
      - Named entities (people, organizations, locations, etc.)

      Document:
      ${documentText}

      Provide the response in JSON format with the following structure:
      {
        "title": "string",
        "author": "string",
        "date": "string",
        "keywords": ["string"],
        "entities": [{"name": "string", "type": "string"}]
      }
    `;

    try {
      const response = await this.invokeModel(prompt);
      return JSON.parse(response) as DocumentInfo;
    } catch (error) {
      logger.error("Error extracting information:", error);
      throw error;
    }
  }
} 