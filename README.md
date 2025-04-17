# AI Docs Assistant

A document management system with AI-powered features.

## Features

- User authentication and authorization
- Document management (CRUD operations)
- File uploads to S3
- Email notifications
- Rate limiting and security measures
- Error handling and logging
- Database integration

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- AWS account (for S3)
- SMTP server (for email)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aidocs-assistant.git
cd aidocs-assistant
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Initialize database:
```bash
chmod +x scripts/init-db.sh
./scripts/init-db.sh
```

5. Start development server:
```bash
npm run dev
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Run the application:
```bash
npm start
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t aidocs-assistant .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env aidocs-assistant
```

## API Documentation

The API documentation is available at `/api-docs` when running the application.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
