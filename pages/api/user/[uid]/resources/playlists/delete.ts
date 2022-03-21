import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import UserModel from "@models/User";
import { handleError } from "@utils/handleError";
import { NextApiRequest, NextApiResponse } from "next";

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

  if (req.method !== "DELETE")
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

  const { playlistKey } = req.body as {
    playlistKey: string;
  };

  try {
    const user = await UserModel.findOne({ uid: headersUid }).select(
      "-password"
    );
    user.playlists.keys = user.playlists.keys.filter(
      (key) => key !== playlistKey
    );

    delete user.playlists[playlistKey];

    user.markModified("playlists");
    await user.save();

    res.status(200).json({
      data: {
        attributes: {
          playlists: user.playlists,
          uid: user._id.toString(),
        },
      },
      error: null,
    });
  } catch (error) {
    handleError(res, error, "user/resources/playlists/create");
  }
};

export default withAuth(withDatabase(handler));
