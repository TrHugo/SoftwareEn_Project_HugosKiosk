import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest"; 
vi.mock("../../src/controllers/article.controller.js", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        getArticleById: vi.fn()
    };
});
import {VALID_TEST_TOKEN_U} from '../function/token_test.js'
import app from "../../src/app.js"; 
import { getArticleById } from "../../src/controllers/article.controller.js";

beforeEach(() => {
  getArticleById.mockReset();
});

const AUTHORIZATION_HEADER = `Bearer ${VALID_TEST_TOKEN_U}`;
const INVALID_AUTHORIZATION_HEADER = `Bearer invalid.token.12345`;
const EXISTING_ARTICLE_ID = 1; 
const NON_EXISTING_ARTICLE_ID = 9999;


describe("GET /article/:articleId", () => {
    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/article/${EXISTING_ARTICLE_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/article/${EXISTING_ARTICLE_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid article", async () => {
        getArticleById.mockResolvedValue({ id: EXISTING_ARTICLE_ID, title: "Titre", content: "Text" });
        const res = await request(app)
            .get(`/article/${EXISTING_ARTICLE_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER); 

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.article).toBeDefined();
        expect(res.body.article.id).toBe(EXISTING_ARTICLE_ID);
    });

    it("400 with valid token and incorrect article id", async () => {
        const res = await request(app)
            .get("/article/invalid-id")
            .set("Authorization", AUTHORIZATION_HEADER);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Article ID incorrect");
    });

    it("404 with valid token if article not found", async () => {
        const res = await request(app)
            .get(`/article/${NON_EXISTING_ARTICLE_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("No Article found");
    });

    it("500 if controller throws an error", async () => {
        getArticleById.mockRejectedValue(new Error("boom"));

        const res = await request(app)
            .get(`/article/${EXISTING_ARTICLE_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe(true);
        expect(typeof res.body.message).toBe("string");
        expect(res.body.message).toBe("boom");
    });

})

    