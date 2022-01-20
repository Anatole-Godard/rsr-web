import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import SessionToken from "@models/SessionToken";
import User from "@models/User";
import { handleError } from "@utils/handleError";
import { NextApiRequest, NextApiResponse } from "next";

const argon2 = require("argon2");

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { oldPassword, newPassword, disconnectAll } = req.body;
    const user = await User.findOne({ _id: req.headers.uid });

    if (!(await argon2.verify(user.password, oldPassword))) {
      return res
        .status(401)
        .json({ data: null, error: { message: "Wrong password", code: 401 } });
    }

    user.password = await argon2.hash(newPassword);
    await user.save();

    if (disconnectAll) await SessionToken.deleteMany({ uid: req.headers.uid });

    return res.status(200).json({
      data: { attributes: { message: "Password changed" } },
      error: null,
    });
  } catch (error) {
    handleError(res, error, "auth/change-password");
  }
}

export default withAuth(withDatabase(handler));
