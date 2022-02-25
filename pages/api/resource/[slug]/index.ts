import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "@utils/handleError";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resource = await Resource.findOne({
      slug : req.query.slug,
    }).lean();

    if (!resource) {
      res.status(404).json({
        data  : null,
        error : {
          code    : 404,
          message : "resource not found",
        },
      });
      return;
    }

    res.status(200).json({
      data: {
        type: "resource",
        id: resource._id,
        attributes: resource,
      },
    });
  } catch (err) {
    handleError(res, err, "resource:slug/index");
  }
}

export default withDatabase(handler);
