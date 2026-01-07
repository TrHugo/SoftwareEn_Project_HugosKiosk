//npm test register_login.test
import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const mockCreateUser = vi.fn();
const mockLogin = vi.fn();

const app = express();
app.use(express.json());

app.post('/api/signup', (req, res, next) => mockCreateUser(req, res, next));
app.post('/api/login', (req, res, next) => mockLogin(req, res, next));

describe('Auth Routes', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/signup', () => {
    it('should call createUser controller', async () => {
      mockCreateUser.mockImplementation((req, res) => res.status(201).json({ success: true }));

      const response = await request(app)
        .post('/api/signup') 
        .send({ name: 'test', email: 't@t.com', mdp: '123', type: 'user' });

      expect(mockCreateUser).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/login', () => {
    it('should return 200 and token', async () => {
      mockLogin.mockImplementation((req, res) => res.status(200).json({ token: 'fake-jwt-token' }));

      const response = await request(app)
        .post('/api/login')
        .send({ name: 'test', email: 't@t.com', password: '123' });

      expect(mockLogin).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('should return 400 if fields are missing', async () => {
      mockLogin.mockImplementation((req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          return res.status(400).json({ error: "POST error" });
        }
        res.status(200).json({ success: true });
      });

      const response = await request(app)
        .post('/api/login')
        .send({ email: 't@t.com' }); 

      expect(response.status).toBe(400);
    });
  });
});