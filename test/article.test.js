/**
 * Integration test for GET /article.
 * Ensures global error handler shapes the response.
 */
import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach} from "vitest";

const mockCheckUser = vi.fn();

vi.mock('../../utils/constant.js', () => ({
    articles: [
        { id: 101, title: 'Article Test Trouvé', content: 'Ceci est le contenu de l article 101.' },
        { id: 102, title: 'Article Test Trouvé 2', content: 'Ceci est le contenu de l article 102.' },
    ],
    Jeton_secret_code: 'mock-secret-for-jwt',
}));

vi.mock('../../utils/JetonVerification.js', () => ({
    checkUser: mockCheckUser,
}));

import articleRouter from '../src/routes/auto/article.route.js'; 

const app = express();
app.use(express.json()); 
app.use(articleRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500; 
    res.status(status).json({
        error: true,
        message: err.message
    });
});


// --- Fonction utilitaire pour préparer une requête authentifiée ---
const getAuthenticatedRequest = (endpoint) => {
    return request(app)
        .get(endpoint)
        // Ceci est la ligne essentielle : simule la présence du jeton
        .set('Authorization', 'Bearer MOCKED_TOKEN'); 
};


describe("GET /article/:articleId", () => {
     beforeEach(() => {
        mockCheckUser.mockImplementation((req, res, next) => {
             req.userData = { userId: 'mockedUserId' };
             req.userType = { userType: 'mockedUserType' };
             next();
        });
    });


    it("returns 200 and the article if the ID is valid and found", async () => {
        const articleId = 101;
        const res = await getAuthenticatedRequest(`/article/${articleId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.article).toBeDefined();
        expect(res.body.article.id).toBe(articleId);
        expect(res.body.article.title).toBe('Article Test Trouvé');
    });

    it("returns 400 if the article ID is not a number (NaN)", async () => {
        const invalidId = "invalid-id";
        const res = await getAuthenticatedRequest(`/article/${invalidId}`);
        expect(res.status).toBe(400); 
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe("Article ID incorrect");
    });

     it("returns 500 if the article ID is valid but no article is found", async () => {
        const notFoundId = 999; 
        const res = await getAuthenticatedRequest(`/article/${notFoundId}`);
        expect(res.status).toBe(500); 
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe("No Article found");
    });

    it("returns 401 if the authentication fails (checkUser error)", async () => {
        mockCheckUser.mockImplementation((req, res, next) => {
             const authError = new Error("Failed Authentification. Access refused");
             authError.status = 401;
             return next(authError);
        });

        const articleId = 101;
        const res = await request(app)
            .get(`/article/${articleId}`)
            .set('Authorization', 'Bearer MOCKED_TOKEN');
        expect(res.status).toBe(401); 
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });
});