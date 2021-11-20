import User from "@models/User";
import { genToken } from "@utils/jwtHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import SessionToken from "@models/SessionToken";
import withDatabase from "@middleware/mongoose";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "Method not allowed",
    });
  }

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  const { email, password } = req.body;
  const { appsource } = req.headers;

  if (!appsource) {
    return res.status(400).json({
      message: "Please provide appsource",
    });
  }

  try {
    const user = await User.findOne({ email }).lean();
    if (user.password !== password) {
      // TODO : hash password
      return res.status(400).json({
        message: "Invalid email or password",
      });
    } else {
      const token = genToken({ uid: user.id, role: user.role });

      const session = await SessionToken.findOneAndUpdate(
        { uid: user.uid, appSource: appsource },
        {
          ...token,
          uid: user.uid,
          role: user.role,
          appSource: appsource,
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({ session, user });
    }
  } catch (err) {
    return res.status(500).json({
      message:
        err instanceof Error ? err.message : "an error occured on: login",
    });
  }
}

export default withDatabase(handler);
