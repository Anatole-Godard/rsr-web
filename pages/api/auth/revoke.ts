import connectDB from "@middleware/mongoose";
import SessionToken from "@models/SessionToken";
import { isTokenValid_middleware, parseAuthorization } from "@utils/jwtHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  isTokenValid_middleware(req, res, async () => {
    const session = await SessionToken.findOne({
      token: parseAuthorization(req.headers.authorization),
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
  });
}

export default connectDB(handler);
