import { describe, it, expect, vi } from "vitest"; 
import {VALID_TEST_TOKEN_U, TEST_TOKEN_NO_DATA, FALSE_TEST_TOKEN} from '../function/token_test.js'
import { checkUser, checkRole } from "../../src/utils/JetonVerification.js";

const AUTHORIZATION_HEADER = `Bearer ${VALID_TEST_TOKEN_U}`
const AUTHORIZATION_HEADER_ND = `Bearer ${TEST_TOKEN_NO_DATA}`
const AUTHORIZATION_HEADER_FALSE = `Bearer ${FALSE_TEST_TOKEN}`

function makeReq(authorizationValue) {
    return {
        headers: { authorization: authorizationValue},
        userData: 0,
        userType: "",
    }; 
}
describe("checkUser", () => {
    it("Verifying the user from the header of the jsp token and getting the userID and userType", () => {
        let req = makeReq(AUTHORIZATION_HEADER);
        let next = vi.fn(); 
        checkUser(req, {}, next);

        expect(req.userData).toEqual({ userId: 1 });
        expect(req.userType).toEqual({ userType: 'user' });
        expect(next).toHaveBeenCalledTimes(1);
      });

    it("Getting a wrong token", () => {
        let req = makeReq(AUTHORIZATION_HEADER_FALSE);
        let next = vi.fn(); 
        checkUser(req, {}, next);

        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual("Failed Authentification. Access refused");
        expect(error.status).toBe(401);
        expect(req.userData).toEqual(0)
    });

    it("Good token but no information", () => {
        let req = makeReq(AUTHORIZATION_HEADER_ND);
        let next = vi.fn(); 
        checkUser(req, {}, next);

        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual("Failed Authentification. Access refused");
        expect(error.status).toBe(401);
        expect(req.userData).toEqual(0)
    });

})