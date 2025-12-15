import request from "supertest";
import app from "../src/app.js"; 
import { describe, it, expect } from "vitest"; 
import {VALID_TEST_TOKEN_U, VALID_TEST_TOKEN_MU, VALID_TEST_TOKEN_P} from './function/token_test.js'

const AUTHORIZATION_HEADER_U = `Bearer ${VALID_TEST_TOKEN_U}`;
const AUTHORIZATION_HEADER_MU = `Bearer ${VALID_TEST_TOKEN_MU}`;
const AUTHORIZATION_HEADER_P = `Bearer ${VALID_TEST_TOKEN_P}`;
const INVALID_AUTHORIZATION_HEADER = `Bearer invalid.token.12345`;
const EXISTING_PUBLISHER_ID = 1
const WRONG_ID = 999

describe("GET /profile/user/:userID", () => {
    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_PUBLISHER_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/profile/user/${EXISTING_PUBLISHER_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid user", async () => {
        const res = await request(app)
            .get(`/profile/user/${EXISTING_PUBLISHER_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_U); 

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toBeDefined();
        expect(res.body.info.id).toBe(EXISTING_PUBLISHER_ID);
    });

    it("400 with valid token and incorrect user id", async () => {
        const res = await request(app)
            .get("/profile/user/invalid-id")
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User ID incorrect");
    });

    it("404 with valid token if user not found", async () => {
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
            .get(`/profile/user/${EXISTING_PUBLISHER_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_P);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access Forbidden");
    });
})




    