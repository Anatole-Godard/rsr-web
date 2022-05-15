import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";
import Resource from "@models/Resource";
import User from "@models/User";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = req.headers as { uid: string };
  const user = await User.findById(uid);

  if (!user)
    return res.status(401).json({
      data: null,
      error: {
        message: "Unauthorized",
        code: 401,
        name: "UnauthorizedError",
      },
    });

  try {
    const create_account = true;
    const create_resource =
      (await Resource.countDocuments({
        "owner.uid": uid,
        validated: true,
      }).exec()) > 0;
    const create_playlist = user.playlists.keys.length > 0;
    const create_resource_comment =
      (await Resource.countDocuments({
        "comments.owner.uid": uid,
      }).exec()) > 0;
    const join_channel =
      (await Channel.countDocuments({
        $or: [{ "members.uid": uid }, { "message.owner.uid": uid }],
      }).exec()) > 0;

    const calc = [
      create_account,
      create_resource,
      create_playlist,
      create_resource_comment,
      join_channel,
    ];

    return res.status(200).json({
      data: {
        attributes: {
          uid,
          create_account,
          create_resource,
          create_playlist,
          create_resource_comment,
          join_channel,
          done: calc.filter((e) => e === true).length,
          remaining: calc.filter((e) => e === false).length,
          total: calc.length,
        },
      },
      error: null,
    });
  } catch (err) {
    handleError(res, err, "user/get-started");
  }
};

export default withAuth(withDatabase(handler));
