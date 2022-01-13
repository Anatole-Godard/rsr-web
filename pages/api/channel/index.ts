import type { NextApiRequest, NextApiResponse } from "next";
import { handleError } from "@utils/handleError";
import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const channels = await Channel.find({}).lean();

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

export default withDatabase(handler);
