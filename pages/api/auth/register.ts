import SessionToken from "@models/SessionToken";
import User from "@models/User";
import { genToken } from "@middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";
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
  const { email, password, birthDate, fullName } = req.body;
  const { appsource } = req.headers;

  if (!email || !password || !birthDate || !fullName) {
    return res.status(400).json({
      error: "MissingParametersError",
      message: "Missing required fields",
      fields: {
        email: !email,
        password: !password,
        birthDate: !birthDate,
        fullName: !fullName,
      },
    });
  }
  if (!appsource) {
    return res.status(400).json({
      error: "MissingAppSourceError",
      message: "Please provide appsource",
    });
  }

  try {
    const user = await User.create({
      email,
      password: await argon2.hash(password),
      birthDate,
      fullName,
    });
    const token = genToken({ uid: user._id.toString(), role: user.role });

    const session = await SessionToken.findOneAndUpdate(
      { uid: user._id.toString(), appSource: appsource },
      {
        ...token,
        uid: user._id.toString(),
        role: user.role,
        appSource: appsource,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      data: {
        _id: user._id,
        uid: user._id.toString(),
        fullName: user.fullName,
        birthDate: user.birthDate,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
      },
      session,
    });
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: {
        name: err instanceof Error ? err.name : "InternalServerError",
        message:
          err instanceof Error ? err.message : "an error occured on: register",
      },
    });
  }
}

export default withDatabase(handler);
