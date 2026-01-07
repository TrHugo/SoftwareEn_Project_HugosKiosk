import request from "supertest";
import { vi, describe, it, expect } from "vitest"; 
import {VALID_TEST_TOKEN_U, VALID_TEST_TOKEN_MA, VALID_TEST_TOKEN_A} from '../function/token_test.js'
import app from "../../src/app.js"; 
import * as userController from '../../src/controllers/user.controller.js';

const AUTHORIZATION_HEADER_U = `Bearer ${VALID_TEST_TOKEN_U}`;
const AUTHORIZATION_HEADER_MA = `Bearer ${VALID_TEST_TOKEN_MA}`;
const AUTHORIZATION_HEADER_A = `Bearer ${VALID_TEST_TOKEN_A}`;
const INVALID_AUTHORIZATION_HEADER = `Bearer invalid.token.12345`;
const EXISTING_ADMIN_ID = 1
const WRONG_ID = 999

// beforeEach(() => vi.restoreAllMocks());

describe("GET /profile/admin/:userID", () => {
    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/profile/admin/${EXISTING_ADMIN_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/profile/admin/${EXISTING_ADMIN_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid user", async () => {
        vi.spyOn(userController, 'getUserById').mockResolvedValue({ id: EXISTING_ADMIN_ID, name: 'test', email: 'test@example.fr' });
        const res = await request(app)
            .get(`/profile/admin/${EXISTING_ADMIN_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_A); 

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toBeDefined();
        expect(res.body.info.id).toBe(EXISTING_ADMIN_ID);
    });

    it("400 with valid token and incorrect user id", async () => {
        const res = await request(app)
            .get("/profile/admin/invalid-id")
            .set("Authorization", AUTHORIZATION_HEADER_A);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Admin ID incorrect");
    });

    it("404 with valid token if user not found", async () => {
        vi.spyOn(userController, 'getUserById').mockResolvedValue(null);
        const res = await request(app)
            .get(`/profile/admin/${WRONG_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_MA);

        expect(res.status).toBe(404); 
        expect(res.body.message).toBe("Admin not found"); 
    });

    it("403 with valid token and valid user but not good ID", async () => {
        const res = await request(app)
            .get(`/profile/admin/${WRONG_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_A);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access refused");
    });

    it("403 with valid token but not a user account", async () => {
        const res = await request(app)
            .get(`/profile/admin/${EXISTING_ADMIN_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access Forbidden");
    });
})




    