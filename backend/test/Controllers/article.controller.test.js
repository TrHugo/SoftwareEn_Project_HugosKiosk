import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as articleController from '../../src/controllers/article.controller.js';
import Article from '../../src/models/article.model.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('article.controller', () => {
  describe('getArticleById', () => {
    it('returns article when found', async () => {
      const article = { _id: '1', title: 't', content: 'c' };
      Article.findById = vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(article) });

      const res = await articleController.getArticleById('1');
      expect(res).toEqual(article);
      expect(Article.findById).toHaveBeenCalledWith('1');
    });

    it('returns null on CastError', async () => {
      const err = new Error('Cast');
      err.name = 'CastError';
      Article.findById = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(err) });

      const res = await articleController.getArticleById('invalid');
      expect(res).toBeNull();
    });

    it('throws other errors', async () => {
      Article.findById = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('boom')) });

      await expect(articleController.getArticleById('1')).rejects.toThrow('boom');
    });
  });

  describe('getArticlesNameAndIDByPublisher', () => {
    it('returns list of articles for publisher', async () => {
      const articles = [{ _id: '1', title: 'A' }, { _id: '2', title: 'B' }];
      Article.find = vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(articles) });

      const res = await articleController.getArticlesNameAndIDByPublisher('pub1');
      expect(res).toEqual(articles);
      expect(Article.find).toHaveBeenCalledWith({ publisher: 'pub1' }, 'title _id');
    });

    it('throws when find rejects', async () => {
      Article.find = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('fail')) });
      await expect(articleController.getArticlesNameAndIDByPublisher('pub')).rejects.toThrow('fail');
    });
  });

  describe('createArticle', () => {
    it('returns 400 when missing fields', async () => {
      const req = { body: { publisher: 'p', title: '' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await articleController.createArticle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required.' });
    });

    it('creates article and returns 201', async () => {
      const req = { body: { publisher: 'p', title: 't', content: 'c' } };
      const created = { _id: '1', publisher: 'p', title: 't', content: 'c' };
      Article.create = vi.fn().mockResolvedValue(created);

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await articleController.createArticle(req, res, next);

      expect(Article.create).toHaveBeenCalledWith({ publisher: 'p', title: 't', content: 'c' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('calls next with error if create throws', async () => {
      const req = { body: { publisher: 'p', title: 't', content: 'c' } };
      const error = new Error('db fail');
      Article.create = vi.fn().mockRejectedValue(error);

      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await articleController.createArticle(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listArticles', () => {
    it('returns list of all articles', async () => {
      const articles = [{ _id: '1' }, { _id: '2' }];
      Article.find = vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(articles) });

      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await articleController.listArticles(req, res, next);

      expect(Article.find).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(articles);
    });

    it('calls next with error when find fails', async () => {
      Article.find = vi.fn().mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('fail')) });

      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      await articleController.listArticles(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});