import { Router } from 'express';
import { AuthService } from '../services/authService';
import { authenticate } from '../middleware/auth';
import { ValidationError } from '../utils/errors';

const router = Router();

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await AuthService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new ValidationError('Name is required');
    }

    req.user.name = name;
    await req.user.save();

    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    });
  } catch (error) {
    next(error);
  }
});

export default router; 