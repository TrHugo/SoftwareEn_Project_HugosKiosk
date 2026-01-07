import request from "supertest";
import { describe, it, expect} from "vitest"; 
import {VALID_TEST_TOKEN_U, VALID_TEST_TOKEN_P, VALID_TEST_TOKEN_A} from '../function/token_test.js'
import app from "../../src/app.js"; 

const AUTHORIZATION_HEADER_U = `Bearer ${VALID_TEST_TOKEN_U}`;
const AUTHORIZATION_HEADER_P = `Bearer ${VALID_TEST_TOKEN_P}`;
const AUTHORIZATION_HEADER_A = `Bearer ${VALID_TEST_TOKEN_A}`;
const INVALID_AUTHORIZATION_HEADER = `Bearer invalid.token.12345`;


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