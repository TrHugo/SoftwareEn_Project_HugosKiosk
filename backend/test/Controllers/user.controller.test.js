import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userController from '../../src/controllers/user.controller.js';
import User from '../../src/models/user.model.js';
import * as passwordHash from '../../src/utils/passwordHash.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('user.controller', () => {
  describe('getUserById', () => {
    it('returns user when found', async () => {
      const user = { id: '1', name: 'Name', email: 'a@b.c' };
      User.findOne = vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(user) });

      const res = await userController.getUserById('1');
      expect(res).toEqual(user);
      expect(User.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('returns null on CastError', async () => {
      const err = new Error('Cast');
      err.name = 'CastError';
      User.findOne = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(err) });

      const res = await userController.getUserById('invalid');
      expect(res).toBeNull();
    });

    it('throws other errors', async () => {
      User.findOne = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('boom')) });
      await expect(userController.getUserById('1')).rejects.toThrow('boom');
    });
  });

  describe('getUserByEmail', () => {
    it('returns user when found', async () => {
      const user = { id: '1', name: 'John', email: 'john@example.com' };
      User.findOne = vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(user) });

      const res = await userController.getUserByEmail('john@example.com');
      expect(res).toEqual(user);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com'});
    });

    it('throws when findOne rejects', async () => {
      User.findOne = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('fail')) });
      await expect(userController.getUserByEmail('a','b')).rejects.toThrow('fail');
    });
  });
    describe('createUser', () => {
    const validData = {
      name: 'Leo',
      email: 'test@example.com',
      mdp: 'Password123!', 
      role: 'user' 
    };

    it('returns 400 when missing fields', async () => {
      
      const req = { body: { name: 'Leo', email: 'test@example.com' } }; 
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Tous les champs (name, email, mdp, role) sont requis." 
      });
    });

    it('returns 400 when email format is invalid', async () => {
      const req = { body: { ...validData, email: 'mauvais-format' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Format de l'email invalide." });
    });

    it('returns 400 when password is too weak', async () => {
      const req = { body: { ...validData, mdp: '123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial." 
      });
    });

    it('hashes password and creates user with Date.now() ID', async () => {
      const req = { body: validData };
      const created = { 
        toObject: () => {
          const obj = { _id: 'mongo_id', id: 12345678, ...validData };
          return obj;
        }
      };

      User.findOne = vi.fn().mockResolvedValue(null);

      vi.spyOn(passwordHash, 'hashPassword').mockResolvedValue('hashed_pw');
      User.create = vi.fn().mockResolvedValue(created);

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        email: validData.email,
        mdp: 'hashed_pw',
        role: 'user',
        id: expect.any(Number) 
      }));
    
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.user).not.toHaveProperty('mdp'); 
    });

    it('returns 409 when email already exists', async () => {
      const req = { body: validData };
      User.findOne = vi.fn().mockResolvedValue({ email: validData.email });

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409); 
      expect(res.json).toHaveBeenCalledWith({ error: "Cet email est déjà utilisé." });
    });

    it('calls next with error if create throws', async () => {
      const req = { body: validData };
      const error = new Error('db fail');
  
      User.findOne = vi.fn().mockResolvedValue(null);
      vi.spyOn(passwordHash, 'hashPassword').mockResolvedValue('hashed');
      User.create = vi.fn().mockRejectedValue(error);

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});