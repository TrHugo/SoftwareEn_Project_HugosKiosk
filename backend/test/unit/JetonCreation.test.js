import { describe, it, expect, vi, afterEach } from "vitest";
import { login } from "../../src/utils/JetonCreation.js";
import * as userController from "../../src/controllers/user.controller.js";
import bcrypt from "bcrypt";

function makeReq(data) {
    return { body: data };
}
function makeRes() { return{
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn()
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("login", () => {

  it("test When identification works", async () => {
    const hashed = await bcrypt.hash("test_mdp", 10);
    vi.spyOn(userController, "getUserByEmailAndMail").mockResolvedValue({ _id: "id123", mdp: hashed, role: "user", name: "John", email: "test@example.fr" });

    let req = makeReq({ name: "John", email: "test@example.fr", password: "test_mdp" });
    let res = makeRes();
    let next = vi.fn();
    await login(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("test when incorrect password", async () => {
    const hashed = await bcrypt.hash("correct_mdp", 10);
    vi.spyOn(userController, "getUserByEmailAndMail").mockResolvedValue({ _id: "id", mdp: hashed, role: "user", name: "John", email: "test@example.fr" });

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
    vi.spyOn(userController, "getUserByEmailAndMail").mockResolvedValue(null);

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
    vi.spyOn(userController, "getUserByEmailAndMail").mockImplementation(() => { throw new Error("DB fail"); });

    let req = makeReq({ name: "John", email: "test@example.fr", password: "test_mdp" });
    let res = {};
    let next = vi.fn();
    await login(req, res, next);

    let error = next.mock.calls[0][0];
    expect(next).toHaveBeenCalledTimes(1);
    expect(error.status).toBe(500);
  });
});

