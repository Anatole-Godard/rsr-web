import { getUidFromJWT } from "../libs/getCurrentUser";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

const _MOCK_JWT_SECRET = "secret";
const _MOCK_JWT_TOKEN = jwt.sign(
  { uid: "123", role: "admin" },
  _MOCK_JWT_SECRET
);

beforeEach(() => {
  process.env.JWT_SECRET = _MOCK_JWT_SECRET;
})

describe("a utility that gets the current user", () => {
  it("should throw an error if no req", async () => {
    await expect(getUidFromJWT(undefined)).rejects.toThrow("req is required");
  });

  it("should return null if no authorization header", async () => {
    const req = { headers: {} };
    const result = await getUidFromJWT(req as NextApiRequest);
    expect(result).toBeNull();
  });

  it("should return null if no token", async () => {
    const req = { headers: { authorization: "Bearer " } };
    const result = await getUidFromJWT(req as NextApiRequest);
    expect(result).toBeNull();
  });

  it("should return null if token is invalid", async () => {
    const req = { headers: { authorization: "Bearer invalid" } };
    const result = await getUidFromJWT(req as NextApiRequest);
    expect(result).toBeNull();
  });

  it("should return uid", async () => {
    const req = { headers: { authorization: "Bearer " + _MOCK_JWT_TOKEN } };
    const result = await getUidFromJWT(req as NextApiRequest);
    expect(result).toBe("123");
  });
});
