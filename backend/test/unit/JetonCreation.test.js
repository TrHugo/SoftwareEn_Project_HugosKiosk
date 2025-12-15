import { describe, it, expect, vi } from "vitest";
import { login } from "../../src/utils/JetonCreation.js";

function makeReq(data) {
    return {
        body: data
    }; 
}
function makeRes() { return{
    status: vi.fn().mockReturnThis(), 
    json: vi.fn(),
    send: vi.fn()
  };
}

describe("login", () => {

      it("test When identification works", async () => {
        let req = makeReq({ email: "test@example.fr", password:"test_mdp"});
        let res = makeRes();
        let next = vi.fn();
        await login(req, res, next);

        expect(next).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("test when incorrect password", async () => {
        let req = makeReq({ email: "test@example.fr", password:"test"});
        let res = {};
        let next = vi.fn();
        await login(req, res, next);

        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(401);
        expect(error.message).toBe("E-mail ou mot de passe incorrect.");
      });

      it("test when incorrect email", async () => {
        let req = makeReq({ email: "fauxtestemail", password:"test_mdp"});
        let res = {};
        let next = vi.fn();
        await login(req, res, next);

        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(401);
        expect(error.message).toBe("E-mail ou mot de passe incorrect.");
      });

      it("test when no information in POST", async () => {
        let req = makeReq({ email: "", password:""});
        let res = {};
        let next = vi.fn();
        await login(req, res, next);

        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(401);
        expect(error.message).toBe("E-mail ou mot de passe incorrect.");
      });

      it("test when POST error", async () => {
        let req = makeReq({});
        let res = {};
        let next = vi.fn();
        await login(req, res, next);

        let error = next.mock.calls[0][0];
        expect(next).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(500);
      });
})

