// This file would contain AWS configuration
// It would be used by the AWS service to configure the AWS SDK

export const awsConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  s3: {
    bucketName: process.env.AWS_S3_BUCKET || "ai-file-assistant-resources",
  },
  dynamodb: {
    resourcesTable: process.env.AWS_DYNAMODB_RESOURCES_TABLE || "ai-file-assistant-resources",
    collectionsTable: process.env.AWS_DYNAMODB_COLLECTIONS_TABLE || "ai-file-assistant-collections",
    chatThreadsTable: process.env.AWS_DYNAMODB_CHAT_THREADS_TABLE || "ai-file-assistant-chat-threads",
    chatMessagesTable: process.env.AWS_DYNAMODB_CHAT_MESSAGES_TABLE || "ai-file-assistant-chat-messages",
  },
  bedrock: {
    modelId: process.env.AWS_BEDROCK_MODEL_ID || "anthropic.claude-v2",
  },
  lambda: {
    processorFunction: process.env.AWS_LAMBDA_PROCESSOR_FUNCTION || "ai-file-assistant-processor",
  },
}
