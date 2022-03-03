import withDatabase from "@middleware/mongoose";
import SessionToken from "@models/SessionToken";
import { parseAuthorization, withAuth } from "@middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      data: null,
      error: {
        name: "MethodNotAllowedError",
        message: "Method not allowed",
      },
    });
  }

  if (!req.headers?.authorization)
    return res.status(401).json({
      data: null,
      error: {
        name: "InvalidTokenError",
        message: "No token provided",
      },
    });
  const token = parseAuthorization(req.headers.authorization);
  if (!token)
    return res.status(401).json({
      data: null,
      error: {
        name: "InvalidTokenError",
        message: "No token provided",
      },
    });

  const session = await SessionToken.findOne({
    token,
  });

  if (session) {
    await session.remove();
    return res.status(200).json({
      data: {
        attributes: "session revoked",
      },
      error: null,
    });
  } else {
    return res.status(404).json({
      data: null,
      error: {
        name: "NotFoundError",
        message: "Session not found",
      },
    });
  }
}

export default withAuth(withDatabase(handler));
