import type { NextApiRequest, NextApiResponse } from "next";
import Channel from "@models/Channel";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { withAuth } from "@middleware/auth";
import { getUser } from "libs/getCurrentUser";
import { UserMinimum } from "@definitions/User";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let channel = await Channel.findOne({
      slug: req.query.slug,
    });

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

    const user = JSON.parse(JSON.stringify(await getUser(req)));
    if (!user) {
      return res.status(401).json({
        data: null,
        error: {
          code: 401,
          message: "unauthorized",
        },
      });
    }

    if (channel.owner.uid === user._id) {
      return res.status(403).json({
        data: null,
        error: {
          code: 403,
          message: "forbidden",
        },
      });
    }

    channel.members = channel.members.filter(
      (member: UserMinimum) => member.uid !== user._id
    );

    await channel.save();

    res.status(200).json({
      data: {
        type: "channel",
        attributes: channel,
      },
    });
  } catch (err) {
    handleError(res, err, "channel:slug/quit");
  }
}

export default withAuth(withDatabase(handler));
