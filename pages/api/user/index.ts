import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import User from "@models/User";
import { handleError } from "libs/handleError";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await User.find({validated: true});
    res.status(200).json({
      data: {
        type: "user",
        id: "all",
        attributes: users.map((user) => ({
          uid: user._id,
          fullName: user.fullName,
          photoURL: user.photoURL,
        })),
      },
    });
  } catch (err) {
    handleError(res, err, "user/all");
  }
}

export default withDatabase(handler);
