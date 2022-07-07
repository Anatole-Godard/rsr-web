import SessionToken from "@models/SessionToken";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * It generates a JWT token and a refresh token
 * @param userData - { uid: string; role: string }
 */
export const genToken = (userData: { uid: string; role: string }) => ({
  token: jwt.sign(
    {
      uid: userData.uid,
      role: userData.role,
      refresh: false,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "3h",
    }
  ),
  refreshToken: jwt.sign(
    {
      uid: userData.uid,
      roles: userData.role,
      refresh: true,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "24h",
    }
  ),
  issuedAt: new Date().getTime(),
});

/**
 * Given an authorization header, return the token
 * @param {string | undefined} authorization - The authorization header that you want to parse.
 */
export const parseAuthorization = (
  authorization: string | undefined
): string | null =>
  authorization != null ? authorization.replace("Bearer ", "") : null;

/**
 * It checks if the token is valid and returns a boolean
 * @param {string | undefined} authorization - The authorization header sent by the client.
 * @param {NextApiRequest} req - NextApiRequest
 * @param {NextApiResponse} res - NextApiResponse
 * @returns A boolean value indicating if the token is valid or not.
 */
export const isTokenValid = async (
  authorization: string | undefined
  // req: NextApiRequest,
  // res: NextApiResponse
) => {
  const token = parseAuthorization(authorization);
  let result: { valid: boolean; code?: string } = { valid: false };

  try {
    if (token !== null) {
      if (!(await SessionToken.exists({ token })))
        result = { valid: false, code: "TokenDatabaseInexistantError" };
      jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
        if (err) result = { valid: false, code: err.name };
        else result = { valid: true };
      });
    } else result = { valid: false, code: "TokenHeaderInexistantError" };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    result = { valid: false, code: err.name };
  }

  return result;
};

/**
 * If the request has a valid token, then the handler is called. Otherwise, the request is rejected
 * @param {Function} handler - Function
 * @returns A function that takes in a NextApiRequest and NextApiResponse and returns a Promise.
 */
export const withAuth =
  (handler: ()=>{}) => async (req: NextApiRequest, res: NextApiResponse) => {
    const headerAuth = req.headers.authorization;
    const validation = await isTokenValid(headerAuth);
    if (validation.valid) {
      return handler(req, res);
    } else
      return res.status(403).json({
        data: null,
        error: {
          code: 403,
          name: validation.code,
          message: "Forbidden",
          origin: req.url,
          user: req.headers.uid || "unknown",
        },
      });
  };

interface Decoded {
  refresh: boolean;
  uid: string;
  role: string;
}

/**
 * It takes in a request and a response, and it checks if the refresh token is valid. If it is, it
 * generates a new token and returns it
 * @param {NextApiRequest} req - NextApiRequest
 * @param {NextApiResponse} res - NextApiResponse
 */
export const refreshTokenHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const RefreshAuth = req.body.refreshToken;

  if (RefreshAuth === null) {
    res.status(400).json({
      message: "missing parameters",
      statusCode: res.statusCode,
    });
  }

  const refreshToken = parseAuthorization(RefreshAuth);

  jwt.verify(
    refreshToken as string,
    process.env.JWT_SECRET as string,
    (err, decoded) => {
      if (err || !(decoded as Decoded)?.refresh) {
        if (err?.name === "TokenExpiredError") {
          res.status(401).json({
            error: err.name,
            message: err.message,
            statusCode: res.statusCode,
          });
        } else {
          res.status(403).json({
            error: "TokenInvalidError",
            message: "wrong token",
            statusCode: res.statusCode,
          });
        }
      } else {
        const userData = {
          uid: (decoded as Decoded).uid,
          role: (decoded as Decoded).role,
        };

        const token = genToken(userData);
        res.status(200).json({
          message: "token successfully refreshed",
          statusCode: res.statusCode,
          token,
        });
      }
    }
  );
};
