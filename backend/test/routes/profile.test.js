import request from "supertest";
import { vi, describe, it, expect} from "vitest"; 
import {VALID_TEST_TOKEN_U, VALID_TEST_TOKEN_P, VALID_TEST_TOKEN_A,
    VALID_TEST_TOKEN_MU, VALID_TEST_TOKEN_MP, VALID_TEST_TOKEN_MA
} from '../function/token_test.js'
import app from "../../src/app.js"; 
import * as userController from '../../src/controllers/user.controller.js';

const AUTHORIZATION_HEADER_U = `Bearer ${VALID_TEST_TOKEN_U}`;
const AUTHORIZATION_HEADER_P = `Bearer ${VALID_TEST_TOKEN_P}`;
const AUTHORIZATION_HEADER_A = `Bearer ${VALID_TEST_TOKEN_A}`;
const AUTHORIZATION_HEADER_MU = `Bearer ${VALID_TEST_TOKEN_MU}`;
const AUTHORIZATION_HEADER_MP = `Bearer ${VALID_TEST_TOKEN_MP}`;
const AUTHORIZATION_HEADER_MA = `Bearer ${VALID_TEST_TOKEN_MA}`;
const INVALID_AUTHORIZATION_HEADER = `Bearer invalid.token.12345`;
const EXISTING_ID = 1
const WRONG_ID = 999

describe("GET /profile", () => {

    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/profile`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/profile`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 returns id and type for admin token", async () => {
        const res = await request(app)
            .get(`/profile`)
            .set("Authorization", AUTHORIZATION_HEADER_A);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toEqual({ id: 1, type: 'admin' });
    });

    it("200 returns id and type for publisher token", async () => {
        const res = await request(app)
            .get(`/profile`)
            .set("Authorization", AUTHORIZATION_HEADER_P);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toEqual({ id: 1, type: 'publisher' });
    });

    it("200 returns id and type for user token", async () => {
        const res = await request(app)
            .get(`/profile`)
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toEqual({ id: 1, type: 'user' });
    });

})

describe("GET /profile/admin/:userID", () => {
    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/profile/admin/${EXISTING_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/profile/admin/${EXISTING_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid user", async () => {
        vi.spyOn(userController, 'getUserById').mockResolvedValue({ id: EXISTING_ID, name: 'test', email: 'test@example.fr' });
        const res = await request(app)
            .get(`/profile/admin/${EXISTING_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_A); 

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toBeDefined();
        expect(res.body.info.id).toBe(EXISTING_ID);
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
            .get(`/profile/admin/${EXISTING_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access Forbidden");
    });
})

describe("GET /profile/publisher/:userID", () => {

    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid publisher", async () => {
        vi.spyOn(userController, 'getUserById').mockResolvedValue({ id: EXISTING_ID, name: 'pub' });
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_P); 

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toBeDefined();
        expect(res.body.info.id).toBe(EXISTING_ID);
    });

    it("400 with valid token and incorrect article id", async () => {
        const res = await request(app)
            .get("/profile/publisher/invalid-id")
            .set("Authorization", AUTHORIZATION_HEADER_P);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Publisher ID incorrect");
    });

    it("404 with valid token if publisher not found", async () => {
        vi.spyOn(userController, 'getUserById').mockResolvedValue(null);
        const res = await request(app)
            .get(`/profile/publisher/${WRONG_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_MP);

        expect(res.status).toBe(404); 
        expect(res.body.message).toBe("Publisher user not found"); 
    });

    it("403 with valid token and valid publisher but not good ID", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${WRONG_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_P);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access refused");
    });

    it("403 with valid token and valid publisher but not right publisher", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access Forbidden");
    });

})

describe("GET /profile/user/:userID", () => {
    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/profile/user/${EXISTING_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/profile/user/${EXISTING_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid user", async () => {
        vi.spyOn(userController, 'getUserById').mockResolvedValue({ id: EXISTING_ID, name: 'test', email: 'test@example.fr' });
        const res = await request(app)
            .get(`/profile/user/${EXISTING_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_U); 

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toBeDefined();
        expect(res.body.info.id).toBe(EXISTING_ID);
    });

    it("400 with valid token and incorrect user id", async () => {
        const res = await request(app)
            .get("/profile/user/invalid-id")
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User ID incorrect");
    });

    it("404 with valid token if user not found", async () => {
        vi.spyOn(userController, 'getUserById').mockResolvedValue(null);
        const res = await request(app)
            .get(`/profile/user/${WRONG_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_MU);

        expect(res.status).toBe(404); 
        expect(res.body.message).toBe("User not found"); 
    });

    it("403 with valid token and valid user but not good ID", async () => {
        const res = await request(app)
            .get(`/profile/user/${WRONG_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access refused");
    });

    it("403 with valid token but not a user account", async () => {
        const res = await request(app)
            .get(`/profile/user/${EXISTING_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_P);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access Forbidden");
    });
})


    