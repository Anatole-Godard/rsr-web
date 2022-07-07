import { Resource } from "@definitions/Resource";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import ResourceModel from "@models/Resource";
import { handleError } from "libs/handleError";
import { toResourceMinimum } from "libs/toMinimum";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid: queryUid } = req.query as { uid: string };
    const { uid: headersUid } = req.headers as { uid: string };

    if (!queryUid || !headersUid)
      return res.status(400).json({
        data: null,
        error: {
          message: "Missing uid",
          code: 400,
          name: "MissingUidError",
        },
      });

    if (queryUid !== headersUid)
      return res.status(401).json({
        data: null,
        error: {
          code: 401,
          message: "Unauthorized",
          name: "UnauthorizedError",
          user: headersUid,
        },
      });

    const resources: Resource[] = await ResourceModel.find({
      "owner.uid": queryUid,
      validated: false,
    });

    return res.status(200).json({
      data: {
        attributes: resources.map(toResourceMinimum),
        type: "resource",
        id: "awaitingValidation",
      },
      error: null,
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, req.url);
  }
};

export default withAuth(withDatabase(handler));
