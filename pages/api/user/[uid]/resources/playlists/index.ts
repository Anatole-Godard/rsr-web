import { User } from "@definitions/User";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import { getUser } from "libs/getCurrentUser";
import { handleError } from "libs/handleError";
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
        cause: {
          "!headersUid": !headersUid,
          "!queryUid": !queryUid,
          "!headersUid === !queryUid": !headersUid === !queryUid,
          headersUid,
          queryUid,
        },
      },
    });

  try {
    const user: User = await getUser(req);
    res.status(200).json({
      data: { attributes: user.playlists },
      error: null,
    });
  } catch (err) {
    handleError(res, err, "user/resources/playlist");
  }
};

export default withAuth(withDatabase(handler));
