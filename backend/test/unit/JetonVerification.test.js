import { describe, it, expect, vi } from "vitest";
import { user_profile_access, publisher_profile_access } from '../../src/utils/constant.js'
import {VALID_TEST_TOKEN_U, TEST_TOKEN_NO_DATA, FALSE_TEST_TOKEN} from '../function/token_test.js'
import { checkUser, checkRole } from "../../src/utils/JetonVerification.js";
import jwt from 'jsonwebtoken';

const AUTHORIZATION_HEADER = `Bearer ${VALID_TEST_TOKEN_U}`
const AUTHORIZATION_HEADER_ND = `Bearer ${TEST_TOKEN_NO_DATA}`
const AUTHORIZATION_HEADER_FALSE = `Bearer ${FALSE_TEST_TOKEN}`

function makeReq(authorizationValue, data, type) {
    return {
        headers: { authorization: authorizationValue},
        userData: data,
        userRole: type,
    }; 
}

describe("checkUser", () => {

    it("Verifying the user from the header of the jsp token and getting the userID and userRole", () => {
        const mockPayload = { id: '1', role: 'user' };
        vi.spyOn(jwt, 'verify').mockReturnValue(mockPayload);
        const req = {
        headers: {
            authorization: 'Bearer mon_faux_token'
        }
        };
        const res = {};
        const next = vi.fn();

        checkUser(req, res, next);

        expect(req.userId).toEqual('1');
        expect(req.userRole).toEqual('user');
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        });

    it("Getting a wrong token", () => {
        vi.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error("invalid token");
        });

        const req = {
            headers: { authorization: 'Bearer WRONG_TOKEN' },
            userData: 0
        };
        const next = vi.fn();

        checkUser(req, {}, next);

        const error = next.mock.calls[0][0];

        expect(next).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual("Failed Authentification. Access refused");
        expect(error.status).toBe(401);
        
        expect(req.userId).toBeUndefined();
    });

    it("Good token but no information", () => {
        let req = makeReq(AUTHORIZATION_HEADER_ND,0,"");
        let next = vi.fn(); 
        checkUser(req, {}, next);

        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual("Failed Authentification. Access refused");
        expect(error.status).toBe(401);
        expect(req.userData).toEqual(0)
    });
});

describe("checkRole", () => {

    it("If the user is of the right type", () => {
        let req = makeReq(AUTHORIZATION_HEADER,1,"user");
        let next = vi.fn(); 
        const roleTest = checkRole(user_profile_access);
        roleTest(req, {},next)
        
        expect(next).toHaveBeenCalledTimes(1);
      });

      it("If the user if of the wrong type", () => {
        let req = makeReq(AUTHORIZATION_HEADER,1,"user");
        let next = vi.fn(); 
        const roleTest = checkRole(publisher_profile_access);
        roleTest(req,{},next)
        
        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(403);
        expect(error.message).toEqual("Access Forbidden");
      });

      it("if the type information is not here", () => {
        let req = makeReq(AUTHORIZATION_HEADER,0,"");
        let next = vi.fn(); 
        const roleTest = checkRole(user_profile_access);
        roleTest(req,{},next)
        
        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(500);
        expect(error.message).toEqual("No role found");
      });
})