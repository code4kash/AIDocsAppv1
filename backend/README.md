# AI Docs Assistant Backend

This is the backend service for the AI Docs Assistant application. It provides APIs for document management, user authentication, and AI-powered document analysis.

## Features

- User authentication and authorization
- Document CRUD operations
- Document search and filtering
- AI-powered document analysis
- File upload and storage
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- AWS account (for S3 storage)
- OpenAI API key

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-secret-key
   MONGODB_URI=mongodb://localhost:27017/aidocs-assistant
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   S3_BUCKET_NAME=aidocs-assistant
   OPENAI_API_KEY=your-openai-api-key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start the production server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Documents

- `GET /api/documents` - Get all documents for the authenticated user
- `GET /api/documents/public` - Get all public documents
- `GET /api/documents/:id` - Get a specific document
- `POST /api/documents` - Create a new document
- `PUT /api/documents/:id` - Update a document
- `DELETE /api/documents/:id` - Delete a document

## Testing

Run tests:
```bash
npm test
```

## License

MIT
