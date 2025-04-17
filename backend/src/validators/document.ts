import { body } from 'express-validator';

export const createDocumentValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('fileUrl')
    .optional()
    .isURL()
    .withMessage('File URL must be a valid URL'),
  body('fileType')
    .optional()
    .isString()
    .withMessage('File type must be a string'),
  body('fileSize')
    .optional()
    .isNumeric()
    .withMessage('File size must be a number'),
];

export const updateDocumentValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title must not be empty'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content must not be empty'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
]; 