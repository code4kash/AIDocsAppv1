# AI File Assistant - AWS Deployment

This directory contains the AWS serverless deployment configuration for the AI File Assistant backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- [Serverless Framework](https://www.serverless.com/) installed globally (`npm install -g serverless`)

## AWS Services Used

- **AWS Lambda** - For serverless function execution
- **Amazon DynamoDB** - For storing resource metadata, collections, and chat history
- **Amazon S3** - For storing uploaded files
- **Amazon Bedrock** - For AI model inference
- **Amazon API Gateway** - For creating RESTful APIs

## Deployment

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Deploy to AWS:

\`\`\`bash
serverless deploy --stage dev
\`\`\`

For production:

\`\`\`bash
serverless deploy --stage prod
\`\`\`

## Environment Variables

The following environment variables are automatically set during deployment:

- `STAGE` - Deployment stage (dev, prod, etc.)
- `RESOURCES_TABLE` - DynamoDB table for storing resource metadata
- `COLLECTIONS_TABLE` - DynamoDB table for storing collections
- `CHAT_THREADS_TABLE` - DynamoDB table for storing chat threads
- `CHAT_MESSAGES_TABLE` - DynamoDB table for storing chat messages
- `RESOURCES_BUCKET` - S3 bucket for storing uploaded files

## API Endpoints

The deployment creates the following API endpoints:

- `GET /resources` - Get resources with optional filtering
- `POST /resources` - Create a new resource
- `GET /collections` - Get all collections
- `POST /collections` - Create a new collection
- `POST /chat` - Process a chat message
- `GET /chat/threads` - Get all chat threads for a user
- `GET /chat/threads/{threadId}/messages` - Get all messages for a chat thread

## Local Development

For local development, you can use the Serverless Offline plugin:

\`\`\`bash
serverless offline
\`\`\`

This will start a local API Gateway emulator on http://localhost:3000.

## Connecting to the Frontend

Update the `.env.local` file in your Next.js project with the API Gateway URL:

\`\`\`
NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
\`\`\`

## Monitoring and Logs

You can view logs for each Lambda function using the Serverless CLI:

\`\`\`bash
serverless logs -f functionName
\`\`\`

For example:

\`\`\`bash
serverless logs -f getResources
\`\`\`

## Cleanup

To remove all deployed resources:

\`\`\`bash
serverless remove
