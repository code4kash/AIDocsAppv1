import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from '../types/auth';

export class AuthService {
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: credentials.email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user
      const user = new User({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      const authError: AuthError = {
        code: 'REGISTRATION_ERROR',
        message: error instanceof Error ? error.message : 'Registration failed',
      };
      throw authError;
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user
      const user = await User.findOne({ email: credentials.email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isMatch = await user.comparePassword(credentials.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      const authError: AuthError = {
        code: 'LOGIN_ERROR',
        message: error instanceof Error ? error.message : 'Login failed',
      };
      throw authError;
    }
  }

  private static generateToken(userId: string) {
    return {
      token: jwt.sign({ id: userId }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      }),
      expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    };
  }
} 