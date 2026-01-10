import { describe, it, expect, vi, afterEach } from "vitest";
import { login } from "../../src/utils/JetonCreation.js";
import * as userController from "../../src/controllers/user.controller.js";
import * as passwordUtils from "../../src/utils/passwordHash.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function makeReq(data) {
    return { body: data };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("login", () => {

 it("test When identification works", async () => {
    const mockUser = { 
      id: "id123", 
      mdp: "hashed_password_in_db", 
      role: "user", 
      name: "John", 
      email: "test@example.fr" 
    };
    
    vi.spyOn(userController, "getUserByEmail").mockResolvedValue(mockUser);

    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValue(true);

    vi.spyOn(jwt, "sign").mockReturnValue("mocked_token");
    process.env.JETON_CODE = "test_secret";

    const req = {
      body: { email: "test@example.fr", password: "test_mdp" }
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Connexion réussie",
      token: "mocked_token",
      user: {
        name: "John",
        email: "test@example.fr"
      }
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it("test when incorrect password", async () => {
    const hashed = await bcrypt.hash("correct_mdp", 10);
    vi.spyOn(userController, "getUserByEmail").mockResolvedValue({ _id: "id", mdp: hashed, role: "user", name: "John", email: "test@example.fr" });

    let req = makeReq({ name: "John", email: "test@example.fr", password: "wrong" });
    let res = {};
    let next = vi.fn();
    await login(req, res, next);

    let error = next.mock.calls[0][0];
    expect(next).toHaveBeenCalledTimes(1);
    expect(error.status).toBe(401);
    expect(error.message).toBe("E-mail ou mot de passe incorrect.");
  });

  it("test when incorrect email", async () => {
    vi.spyOn(userController, "getUserByEmail").mockResolvedValue(null);

    let req = makeReq({ name: "John", email: "fauxtestemail", password: "test_mdp" });
    let res = {};
    let next = vi.fn();
    await login(req, res, next);

    let error = next.mock.calls[0][0];
    expect(next).toHaveBeenCalledTimes(1);
    expect(error.status).toBe(401);
    expect(error.message).toBe("E-mail ou mot de passe incorrect.");
  });

  it("test when no information in POST", async () => {
    let req = makeReq({});
    let res = {};
    let next = vi.fn();
    await login(req, res, next);

    let error = next.mock.calls[0][0];
    expect(next).toHaveBeenCalledTimes(1);
    expect(error.status).toBe(400);
    expect(error.message).toBe("POST error");
  });

  it("test when POST error", async () => {
    vi.spyOn(userController, "getUserByEmail").mockImplementation(() => { throw new Error("DB fail"); });

    let req = makeReq({ name: "John", email: "test@example.fr", password: "test_mdp" });
    let res = {};
    let next = vi.fn();
    await login(req, res, next);

    let error = next.mock.calls[0][0];
    expect(next).toHaveBeenCalledTimes(1);
    expect(error.status).toBe(500);
  });
});

