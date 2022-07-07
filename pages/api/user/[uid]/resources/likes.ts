import { Resource } from "@definitions/Resource";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import ResourceModel from "@models/Resource";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid: queryUid } = req.query as { uid: string };
    const { uid: headersUid } = req.headers as { uid: string };

    if (
      !queryUid
      //  || !headersUid // TODO: confirm if this is needed
    )
      return res.status(400).json({
        data: null,
        error: {
          message: "Missing uid",
          code: 400,
          name: "MissingUidError",
        },
      });

    // TODO: confirm if this is needed
    // if (queryUid !== headersUid)
    //   return res.status(401).json({
    //     data: null,
    //     error: {
    //       code: 401,
    //       message: "Unauthorized",
    //       name: "UnauthorizedError",
    //       user: headersUid,
    //     },
    //   });

    const resources: Resource[] = await ResourceModel.find({
      "likes.uid": queryUid,
      $or: [{ validated: true }, { "owner.uid": headersUid }],
    });

    return res.status(200).json({
      data: {
        attributes: resources, //.map(toResourceMinimum),
        type: "resource",
        id: "likes",
      },
      error: null,
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, req.url);
  }
};

export default withAuth(withDatabase(handler));
