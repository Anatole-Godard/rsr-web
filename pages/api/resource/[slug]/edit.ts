import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "@utils/handleError";
import { withAuth } from "@middleware/auth";
import { isAdmin } from '@utils/getCurrentUser';

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
      if (!(await isAdmin(req, true))) {
        res.status(403).json({
          data: null,
          error: {
            code: 403,
            message: "forbidden",
          },
        });
        return;
      }
    }

    resource = await Resource.findOneAndUpdate(
      { slug: req.query.slug },
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
