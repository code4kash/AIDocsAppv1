# AI Docs Assistant Frontend

A modern, AI-powered document assistant frontend built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📄 Document Management
- 💬 AI-powered Chat Interface
- 🔐 Secure Authentication
- 🎨 Modern UI with Dark Mode
- 📱 Responsive Design
- 🧪 Comprehensive Testing
- 🚀 Production-Ready Infrastructure

## Prerequisites

- Node.js 20.x
- npm 9.x or later
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aidocs-assistant.git
   cd aidocs-assistant/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Building for Production

```bash
npm run build
```

## Deployment

The application is configured for deployment on Vercel. The CI/CD pipeline automatically:
1. Runs tests
2. Builds the application
3. Deploys to production

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Configuration files
├── hooks/         # Custom React hooks
├── lib/          # Utility functions
├── pages/        # Next.js pages
├── store/        # State management
├── styles/       # Global styles
└── types/        # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
