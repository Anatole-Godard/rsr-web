import { LogBody } from "@definitions/Log";
import Log from "@models/Log";
import User from "@models/User";
import { handleError } from "@utils/handleError";
import { toObjectId } from "@utils/toObjectId";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { location, method, type, url } = req.body as LogBody;
  let { user } = req.body as LogBody;

  if (!location || !method || !type || !user || !url) {
    return res.status(400).json({
      data: null,
      error: {
        message: "Missing required fields",
        code: 400,
        name: "MISSING_FIELDS_ERROR",
      },
    });
  }

  try {
    if (!user.fullName || !user.photoURL) {
      const userDB = (
        await User.findOne({ _id: toObjectId(user.uid) })
      ).toJSON();
      user = { ...user, photoURL: userDB.photoURL, fullName: userDB.fullName };
    }

    const log = await Log.create({
      location,
      method,
      type,
      user,
      url,
    });

    return res.status(200).json({
      data: { attributes: log.toJSON() },
      error: null,
    });
  } catch (e) {
    // @ts-ignore
    handleError(res, e, "log");
  }
};

export default handler;
