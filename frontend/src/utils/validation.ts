export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateDocumentTitle = (title: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(title)) {
    errors.push({
      field: 'title',
      message: 'Title is required'
    });
  }

  if (!validateMinLength(title, 3)) {
    errors.push({
      field: 'title',
      message: 'Title must be at least 3 characters long'
    });
  }

  if (!validateMaxLength(title, 100)) {
    errors.push({
      field: 'title',
      message: 'Title must not exceed 100 characters'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDocumentContent = (content: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(content)) {
    errors.push({
      field: 'content',
      message: 'Content is required'
    });
  }

  if (!validateMinLength(content, 10)) {
    errors.push({
      field: 'content',
      message: 'Content must be at least 10 characters long'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 