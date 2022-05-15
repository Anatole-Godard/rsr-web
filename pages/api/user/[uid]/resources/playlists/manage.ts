import { ResourceMinimum } from "@definitions/Resource";
import { User } from "@definitions/User";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import { getUser } from "libs/getCurrentUser";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@models/User";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid: headersUid }: { uid: string } = req.headers as { uid: string };
  const { uid: queryUid }: { uid: string } = req.query as { uid: string };

  if (!headersUid || !queryUid || headersUid !== queryUid)
    return res.status(403).json({
      data: null,
      error: {
        code: 403,
        name: "UnauthorizedError",
        message: "Not authorized to access this endpoint",
        // cause: {
        //   "!headersUid": !headersUid,
        //   "!queryUid": !queryUid,
        //   "!headersUid === !queryUid": !headersUid === !queryUid,
        //   headersUid,
        //   queryUid,
        // },
      },
    });

  if (req.method !== "POST" && req.method !== "DELETE")
    return res.status(403).json({
      data: null,
      error: {
        code: 403,
        name: "MethodError",
        message: "Bad method for this endpoint",
        cause: {
          method: req.method,
        },
      },
    });
  const { playlistKey, resource } = req.body as {
    playlistKey: string;
    resource: ResourceMinimum;
  };

  try {
    const user = await UserModel.findById(headersUid).select("-password");
    if (req.method === "POST") {
      user.playlists[playlistKey].push(resource);
    } else if (req.method === "DELETE") {
      user.playlists[playlistKey] = user.playlists[playlistKey].filter(
        (resource: ResourceMinimum) => resource.slug !== resource.slug
      );
    }

    user.markModified("playlists");
    await user.save();

    res.status(200).json({
      data: {
        attributes: { playlists: user.playlists, uid: user._id.toString() },
      },
      error: null,
    });
  } catch (err) {
    handleError(res, err, "user/resources/playlist/manage");
  }
};

export default withAuth(withDatabase(handler));
