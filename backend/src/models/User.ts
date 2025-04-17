import { Pool, QueryResult } from 'pg';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  is_email_verified: boolean;
  reset_password_token?: string;
  reset_password_expires?: Date;
  created_at: Date;
  updated_at: Date;
  is_active?: boolean;
}

export interface CreateUserInput {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  role?: string;
  is_active?: boolean;
}

export interface UserModel {
  createUser(email: string, password: string, name: string, role: string): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  listUsers(): Promise<User[]>;
}

export class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async createUser(email: string, password: string, name: string, role: string): Promise<User> {
    const query = `
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [email, password, name, role];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const query = `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [id, ...Object.values(updates)];
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  async listUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async create(input: CreateUserInput): Promise<User> {
    const { email, password, first_name, last_name, role = 'user' } = input;
    
    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [email, password_hash, first_name, last_name, role];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { first_name, last_name, role, is_active } = input;
    const query = `
      UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          role = COALESCE($3, role),
          is_active = COALESCE($4, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const values = [first_name, last_name, role, is_active, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateLastLogin(id: string): Promise<void> {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [id]);
  }

  async verifyPassword(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ValidationError('Invalid email or password');
    }

    return user;
  }
}

export const userModel = new UserModel(); 