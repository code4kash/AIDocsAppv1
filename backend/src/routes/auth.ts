import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { ValidationError, NotFoundError } from '../utils/errors';
import { authenticate, authorize } from '../middleware/auth';
import { userModel, UserModel } from '../models/user';
import express from 'express';
import { AppError } from '../middleware/error';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authLimiter } from '../middleware/rateLimit';

const router = express.Router();

// Register new user
router.post('/register', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      role: 'user',
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const tokens = await AuthService.refreshToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

// Change password
router.post('/change-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current and new passwords are required');
    }

    await AuthService.changePassword(req.user!.userId, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

// Request password reset
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Save reset token to user
    await UserModel.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
    });

    // TODO: Send email with reset link
    // For now, just return the token
    res.json({ message: 'Password reset email sent', token: resetToken });
  } catch (error) {
    next(error);
  }
});

// Reset password
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await UserModel.findById(decoded.id);

    if (!user || user.resetPasswordToken !== token || !user.resetPasswordExpires) {
      throw new AppError(400, 'Invalid or expired reset token');
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new AppError(400, 'Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await UserModel.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.findById(req.user!.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name } = req.body;
    const user = await userModel.update(req.user!.userId, {
      first_name,
      last_name,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Admin routes
router.get('/users', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await (userModel as UserModel).listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, is_active } = req.body;
    const user = await userModel.update(req.params.id, {
      role,
      is_active,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router; 