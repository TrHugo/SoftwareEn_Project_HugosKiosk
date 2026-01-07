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

  describe('getUserByEmailAndMail', () => {
    it('returns user when found', async () => {
      const user = { id: '1', name: 'John', email: 'john@example.com' };
      User.findOne = vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(user) });

      const res = await userController.getUserByEmailAndMail('John', 'john@example.com');
      expect(res).toEqual(user);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com', name: 'John' });
    });

    it('throws when findOne rejects', async () => {
      User.findOne = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('fail')) });
      await expect(userController.getUserByEmailAndMail('a','b')).rejects.toThrow('fail');
    });
  });

  describe('createUser', () => {

    it('returns 400 when missing fields', async () => {
      const req = { body: { name: 'n', email: '' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required.' });
    });

    it('hashes password and creates user', async () => {
      const req = { body: { name: 'n', email: 'e', mdp: 'plain', type: 'user' } };
      const created = { toObject: () => ({ _id: '1', name: 'n', email: 'e', mdp: 'hash', type: 'user' }) };

      User.findOne = vi.fn().mockReturnValueOnce({sort: vi.fn().mockResolvedValue({ id: 10 })});
      User.findOne.mockResolvedValueOnce(null);
      vi.spyOn(passwordHash, 'hashPassword').mockResolvedValue('hash');
      User.create = vi.fn().mockResolvedValue(created);

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(passwordHash.hashPassword).toHaveBeenCalledWith('plain');
      expect(User.create).toHaveBeenCalledWith({ id: 11, name: 'n', email: 'e', mdp: 'hash', type: 'user' });
      expect(res.json).toHaveBeenCalled();
      
      const response = res.json.mock.calls[0][0];
      expect(response.user.email).toBe('e'); 
      expect(response.user.mdp).toBeUndefined();
      expect(response.success).toBe(true);
    });

    it('calls next with error if create throws', async () => {
      const req = { body: { name: 'n', email: 'e', mdp: 'plain', type: 'user' } };
      const error = new Error('db fail');

      User.findOne = vi.fn().mockReturnValueOnce({sort: vi.fn().mockResolvedValue({ id: 10 })});
      User.findOne.mockResolvedValueOnce(null);
      
      vi.spyOn(passwordHash, 'hashPassword').mockResolvedValue('hash');
      User.create = vi.fn().mockRejectedValue(error);

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it('returns 409 when email already exists', async () => {
      const req = { 
        body: { name: 'n', email: 'duplicate@test.com', mdp: 'plain', type: 'user' } 
      };
      
      User.findOne = vi.fn().mockReturnValueOnce({sort: vi.fn().mockResolvedValue({ id: 1 })});
      User.findOne.mockResolvedValueOnce({ email: 'dup@t.com' });

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await userController.createUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'duplicate@test.com' });
      expect(res.status).toHaveBeenCalledWith(409); 
      expect(res.json).toHaveBeenCalledWith({ error: "Email already used" });
  
      expect(User.create).not.toHaveBeenCalled();
    });
  });
});