import { logger } from './index';

interface ErrorContext {
  timestamp: string;
  environment: string;
  user?: {
    id?: string;
    email?: string;
  };
  request?: {
    method?: string;
    url?: string;
    ip?: string;
  };
  stack?: string;
}

export class ErrorTracker {
  private errors: ErrorContext[] = [];
  private maxErrors: number = 1000;

  constructor() {
    // Initialize error tracking service (e.g., Sentry)
    if (process.env.SENTRY_DSN) {
      this.initializeSentry();
    }
  }

  private initializeSentry() {
    // Initialize Sentry here
    // This is a placeholder for actual Sentry initialization
    console.log('Sentry initialized with DSN:', process.env.SENTRY_DSN);
  }

  public captureError(error: Error, context: Partial<ErrorContext> = {}) {
    const errorContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      ...context,
      stack: error.stack
    };

    // Log error
    logger.error('Error captured', {
      error: error.message,
      ...errorContext
    });

    // Store error
    this.errors.push(errorContext);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Send to error tracking service if configured
    if (process.env.SENTRY_DSN) {
      this.sendToSentry(error, errorContext);
    }
  }

  private sendToSentry(error: Error, context: ErrorContext) {
    // Send error to Sentry
    // This is a placeholder for actual Sentry integration
    console.log('Error sent to Sentry:', {
      error: error.message,
      ...context
    });
  }

  public getErrors(): ErrorContext[] {
    return this.errors;
  }

  public clearErrors() {
    this.errors = [];
  }
} 