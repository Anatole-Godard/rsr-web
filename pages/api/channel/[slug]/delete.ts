import type { NextApiRequest, NextApiResponse } from "next";
import Channel from "@models/Channel";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { withAuth } from "@middleware/auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let channel = await Channel.findOne({
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

    if (channel.owner.uid !== req.headers.uid) {
      res.status(403).json({
        data: null,
        error: {
          code: 403,
          message: "forbidden",
        },
      });
      return;
    }

    channel = await Channel.findOneAndDelete({
      slug: req.query.slug,
    }).lean();

    res.status(200).json({
      data: {
        type: "channel",
        id: channel._id,
        attributes: channel,
      },
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "channel:slug/delete");
  }
}

export default withAuth(withDatabase(handler));
