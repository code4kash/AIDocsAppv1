import request from 'supertest';
import { app } from '../app';
import { testPool } from './setup';
import { createUser, deleteUser } from '../services/userService';

describe('Document Controller', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const user = await createUser({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    userId = user.id;

    // Login to get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    authToken = response.body.token;
  });

  afterAll(async () => {
    // Clean up test user
    await deleteUser(userId);
  });

  describe('POST /api/documents', () => {
    it('should create a new document', async () => {
      const response = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Document',
          content: 'This is a test document',
          isPublic: false
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Document');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/documents')
        .send({
          title: 'Test Document',
          content: 'This is a test document',
          isPublic: false
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/documents/my', () => {
    it('should return user documents', async () => {
      const response = await request(app)
        .get('/api/documents/my')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 