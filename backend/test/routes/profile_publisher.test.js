import request from "supertest";
import app from "../../src/app.js"; 
import { describe, it, expect } from "vitest"; 
import {VALID_TEST_TOKEN_U, VALID_TEST_TOKEN_P, VALID_TEST_TOKEN_MP} from '../function/token_test.js'

const AUTHORIZATION_HEADER_U = `Bearer ${VALID_TEST_TOKEN_U}`;
const AUTHORIZATION_HEADER_P = `Bearer ${VALID_TEST_TOKEN_P}`;
const AUTHORIZATION_HEADER_MP = `Bearer ${VALID_TEST_TOKEN_MP}`;
const INVALID_AUTHORIZATION_HEADER = `Bearer invalid.token.12345`;
const EXISTING_PUBLISHER_ID = 1
const WRONG_ID = 999

describe("GET /profile/publisher/:userID", () => {
    it("401 if missing token", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_PUBLISHER_ID}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("401 if invalid token", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_PUBLISHER_ID}`)
            .set("Authorization", INVALID_AUTHORIZATION_HEADER);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Failed Authentification. Access refused");
    });

    it("200 with valid token and valid publisher", async () => {
        const res = await request(app)
            .get(`/profile/publisher/${EXISTING_PUBLISHER_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_P); 

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.info).toBeDefined();
        expect(res.body.info.id).toBe(EXISTING_PUBLISHER_ID);
    });

    it("400 with valid token and incorrect article id", async () => {
        const res = await request(app)
            .get("/profile/publisher/invalid-id")
            .set("Authorization", AUTHORIZATION_HEADER_P);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Publisher ID incorrect");
    });

    it("404 with valid token if publisher not found", async () => {
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
            .get(`/profile/publisher/${EXISTING_PUBLISHER_ID}`)
            .set("Authorization", AUTHORIZATION_HEADER_U);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Access Forbidden");
    });

})




    