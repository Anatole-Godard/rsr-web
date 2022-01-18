import User from "@models/User";
import { genToken } from "@middleware/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import SessionToken from "@models/SessionToken";
import withDatabase from "@middleware/mongoose";
const argon2 = require("argon2");

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      error: "MethodNotAllowedError",
      method: req.method,
      message: "Method not allowed",
    });
  }

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: "MissingParametersError",
      message: "Please provide email and password",
      fields: {
        email: !req.body.email,
        password: !req.body.password,
      },
    });
  }

  const { email, password } = req.body;
  const { appsource } = req.headers;

  if (!appsource) {
    return res.status(400).json({
      error: "MissingAppSourceError",
      message: "Please provide appsource",
    });
  }

  try {
    const user = await User.findOne({ email }).lean();
    if (await argon2.verify(user.password, password)) {
      const token = genToken({ uid: user.id, role: user.role });

      const session = await SessionToken.findOneAndUpdate(
        { uid: user._id, appSource: appsource },
        {
          ...token,
          uid: user._id,
          role: user.role,
          appSource: appsource,
          uidAppSource: `${user._id}:${appsource}`,
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        session,
        data: {
          _id: user._id,
          uid: user._id,
          fullName: user.fullName,
          birthDate: user.birthDate,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: user.createdAt,
        },
      });
    } else {
      return res.status(400).json({
        error: "InvalidCredentialsError",
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.name : "InternalServerError",
      message:
        err instanceof Error ? err.message : "an error occured on: login",
    });
  }
}

export default withDatabase(handler);
