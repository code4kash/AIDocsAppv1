import express from 'express';
import { authenticate } from '../middleware/auth';
import { UserModel } from '../models/user';
import { AppError } from '../middleware/error';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Remove sensitive data
    const { password, resetPasswordToken, resetPasswordExpires, ...userData } = user;
    res.json(userData);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        throw new AppError(400, 'Current password is required');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError(401, 'Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.update(userId, { password: hashedPassword });
    }

    // Update other fields
    const updates: Partial<typeof user> = {};
    if (name) updates.name = name;
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        throw new AppError(400, 'Email already in use');
      }
      updates.email = email;
    }

    if (Object.keys(updates).length > 0) {
      await UserModel.update(userId, updates);
    }

    // Get updated user
    const updatedUser = await UserModel.findById(userId);
    const { password, resetPasswordToken, resetPasswordExpires, ...userData } = updatedUser!;
    res.json(userData);
  } catch (error) {
    next(error);
  }
});

// Delete user account
router.delete('/profile', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    await UserModel.delete(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router; 