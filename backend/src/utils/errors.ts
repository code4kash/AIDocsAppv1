export class BaseError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string) {
    super(401, message);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string) {
    super(403, message);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(409, message);
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string, public retryAfter: number) {
    super(429, message);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(500, message);
  }
}

export class ServiceError extends BaseError {
  constructor(message: string) {
    super(500, message);
  }
}

export class ExternalServiceError extends BaseError {
  constructor(message: string) {
    super(502, message);
  }
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  details?: any;
} 