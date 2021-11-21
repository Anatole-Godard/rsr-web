import SessionToken from "@models/SessionToken";
import User from "@models/User";
import { genToken } from "@utils/jwtHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "Method not allowed",
    });
  }
  const { email, password, birthDate, fullName } = req.body;
  const { appsource } = req.headers;

  if (!email || !password || !birthDate || !fullName) {
    return res.status(400).json({
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
      message: "Please provide appsource",
    });
  }

  try {
    const user = await User.create({ email, password, birthDate, fullName });
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

    res.status(201).json({ data: user, session });
  } catch (err) {
    return res.status(500).json({
      message:
        err instanceof Error ? err.message : "an error occured on: register",
    });
  }
}

export default handler;
