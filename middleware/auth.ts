import SessionToken from "@models/SessionToken";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

// Exported functions

export const genToken = (userData: { uid: string; role: string }) => ({
  token: jwt.sign(
    {
      userId: userData.uid,
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
      userId: userData.uid,
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

export const parseAuthorization = (authorization: string | undefined) =>
  authorization != null ? authorization.replace("Bearer ", "") : null;

export const isTokenValid = async (
  authorization: string | undefined,
  req: NextApiRequest,
  res: NextApiResponse
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
    console.error(err)
    result = { valid: false, code: err.name };
  }
  
  return result;
};

export const withAuth =
  (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
    const headerAuth = req.headers.authorization;
    const validation = await isTokenValid(headerAuth, req, res);
    if (validation.valid) {
      return handler(req, res);
    } else
      return res.status(403).json({
        data: null,
        error: {
          code: 403,
          name: validation.code,
          message: "Forbidden",
        },
      });
  };

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
      if (err || !decoded?.refresh) {
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
          uid: decoded.uid,
          role: decoded.role,
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
