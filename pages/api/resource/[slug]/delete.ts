import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "@utils/handleError";
import { withAuth } from "@middleware/auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let resource = await Resource.findOne({
      slug: req.query.slug,
    }).lean();

    if (!resource) {
      res.status(404).json({
        data: null,
        error: {
          code: 404,
          message: "resource not found",
        },
      });
      return;
    }

    if (resource.owner.uid !== req.headers.uid) {
      res.status(403).json({
        data: null,
        error: {
          code: 403,
          message: "forbidden",
        },
      });
      return;
    }

    resource = await Resource.findOneAndDelete({
      slug: req.query.slug,
    }).lean();

    res.status(200).json({
      data: {
        type: "resource",
        id: resource._id,
        attributes: resource,
      },
    });
  } catch (err) {
    handleError(res, err, "resource:slug/delete");
  }
}

export default withAuth(withDatabase(handler));
