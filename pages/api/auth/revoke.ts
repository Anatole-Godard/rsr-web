import withDatabase from "@middleware/mongoose";
import SessionToken from "@models/SessionToken";
import { parseAuthorization, withAuth } from "@middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "Method not allowed",
    });
  }

  if (!req.headers?.authorization)
    return res.status(401).json({
      message: "No token provided",
    });
  const token = parseAuthorization(req.headers.authorization);
  if (!token)
    return res.status(401).json({
      message: "No token provided",
    });

  const session = await SessionToken.findOne({
    token,
  });

  if (session) {
    await session.remove();
    return res.status(200).json({
      message: "session revoked",
    });
  } else {
    return res.status(404).json({
      message: "session not found",
    });
  }
}

export default withAuth(withDatabase(handler));
