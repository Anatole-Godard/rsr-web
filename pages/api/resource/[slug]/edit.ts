import type { NextApiRequest, NextApiResponse } from "next";
import type { ResourceResponse } from "@definitions/Resource/ResourceResponse";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "@utils/handleError";
import { withAuth } from "@middleware/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.status(405).json({
      data: null,
      error: {
        code: 405,
        message: "method not allowed",
      },
    });
    return;
  }

  try {
    const resource = await Resource.findOneAndUpdate(
      {
        slug: req.query.slug,
      },
      req.body
    ).lean();

    res.status(200).json({
      data: {
        type: "resource",
        id: resource._id,
        attributes: await Resource.findOne({
          slug: req.query.slug,
        }).lean(),
        payload: {
          ...req.body,
        },
      },
    });
  } catch (err) {
    handleError(res, err, "resource:slug/edit");
  }
}

export default withAuth(withDatabase(handler));
