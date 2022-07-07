import type { NextApiRequest, NextApiResponse } from "next";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import Channel from "@models/Channel";
import { withAuth } from "@middleware/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const channel = await Channel.findOne({
      slug: req.query.slug,
    }).lean();

    if (!channel) {
      res.status(404).json({
        data: null,
        error: {
          code: 404,
          message: "channel not found",
        },
      });
      return;
    }

    res.status(200).json({
      data: {
        type: "channel",
        id: channel._id,
        attributes: channel,
      },
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "channel:slug/index");
  }
}

export default withAuth(withDatabase(handler));
