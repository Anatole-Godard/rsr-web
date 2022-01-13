import type { NextApiRequest, NextApiResponse } from "next";
import type { ResourceResponse } from "@definitions/Resource/ResourceResponse";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "@utils/handleError";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResourceResponse>
) {
  try {
    const resource = await Resource.findOne({
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
    handleError(res, err, "resource:slug/index");
  }
}

export default withDatabase(handler);
