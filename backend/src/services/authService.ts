import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { UnauthorizedError, ValidationError, NotFoundError } from '../utils/errors';
import config from '../config/config';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '24h';

  private static generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  static async register(input: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): Promise<{ user: any; tokens: AuthTokens }> {
    const user = await User.findOne({ email: input.email });
    if (user) {
      throw new ValidationError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create new user
    const newUser = new User({
      email: input.email,
      password: hashedPassword,
      first_name: input.first_name,
      last_name: input.last_name,
    });

    await newUser.save();

    const tokens = this.generateTokens({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    return { user: newUser, tokens };
  }

  static async login(email: string, password: string): Promise<{ user: any; tokens: AuthTokens }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await User.updateOne({ _id: user._id }, { $set: { last_login: new Date() } });

    const tokens = this.generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, tokens };
  }

  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        throw new UnauthorizedError('Invalid token');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as TokenPayload;
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.is_active) {
        throw new ValidationError('User account is inactive');
      }

      return this.generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw new ValidationError('Invalid refresh token');
    }
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new ValidationError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
  }

  static async resetPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      this.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset token
    // This would be implemented with a proper email service
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  static async verifyResetToken(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne({ _id: decoded.userId }, { $set: { password: hashedPassword } });
    } catch (error) {
      throw new ValidationError('Invalid or expired reset token');
    }
  }
} 