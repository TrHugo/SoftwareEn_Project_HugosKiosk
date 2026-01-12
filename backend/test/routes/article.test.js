import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest"; 
import app from "../../src/app.js"; 
import { getArticleById } from "../../src/controllers/article.controller.js";
import { VALID_TEST_TOKEN_U } from '../function/token_test.js';

vi.mock("../../src/controllers/article.controller.js", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        getArticleById: vi.fn()
    };
});

vi.mock("../../src/middlewares/auth.middleware.js", () => ({
    checkUser: (req, res, next) => {
        req.userId = "1";
        req.userRole = "user";
        next();
    },
    CheckSubscription: (req, res, next) => {
        next();
    }
}));

const AUTHORIZATION_HEADER = `Bearer ${VALID_TEST_TOKEN_U}`;
const INVALID_AUTHORIZATION_HEADER = `Bearer invalid.token.12345`;
const EXISTING_ARTICLE_ID = 1; 
const NON_EXISTING_ARTICLE_ID = 9999;

beforeEach(() => {
    vi.clearAllMocks();
    process.env.JETON_CODE = process.env.JETON_CODE;
});

describe("GET /api/read/:articleId", () => {

    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/api/read/${EXISTING_ARTICLE_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/api/read/${EXISTING_ARTICLE_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid article", async () => {
        const mockArticle = { id: EXISTING_ARTICLE_ID, title: "Titre", content: "Text" };
        getArticleById.mockResolvedValue(mockArticle);

        const res = await request(app)
            .get(`/api/read/${EXISTING_ARTICLE_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER); 

        expect(res.status).toBe(200);

        expect(res.body).toMatchObject({ title: "Titre" });
    });

    it("400 with valid token and incorrect article id", async () => {
        const res = await request(app)
            .get("/api/read/abc")
            .set("Authorization", AUTHORIZATION_HEADER);

        expect(res.status).toBe(400);
        // Note: vérifie si c'est res.body.message ou res.body.error
        expect(res.body.message || res.body.error).toContain("must be a number");
    });

    it("404 with valid token if article not found", async () => {
        getArticleById.mockResolvedValue(null);

        const res = await request(app)
            .get(`/api/read/${NON_EXISTING_ARTICLE_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER);

        expect(res.status).toBe(404);
        expect(res.body.message || res.body.error).toBe("Article not found");
    });
});