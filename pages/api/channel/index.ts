import type { NextApiRequest, NextApiResponse } from "next";
import { handleError } from "libs/handleError";
import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";
import { withAuth } from "@middleware/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid: string = req.query.uid as string;
  try {
    const channels = await Channel.find({
      $or: [{ visibility: "public" }, { "member.uid": uid }],
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
    handleError(res, err, "channel:all");
  }
}

export default withAuth(withDatabase(handler));
