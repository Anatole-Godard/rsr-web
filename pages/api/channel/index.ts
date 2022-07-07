import type { NextApiRequest, NextApiResponse } from "next";
import { handleError } from "libs/handleError";
import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";
import { withAuth } from "@middleware/auth";
import { getUser } from "@utils/getCurrentUser";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req);
  try {
    const channels = await Channel.find({
      $or: [{ visibility: "public" }, { "members.uid": user.uid }],
    }).lean();

    return res.status(200).json({
      data: {
        type: "channel",
        id: "all",
        attributes: channels,
        search: false,
      },
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "channel:all");
  }
}

export default withAuth(withDatabase(handler));
