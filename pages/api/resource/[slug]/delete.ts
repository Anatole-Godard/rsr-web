import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import User from "@models/User";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { withAuth } from "@middleware/auth";
import Notification from "@models/Notification";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "DELETE") {
      res.status(405).json({
        data: null,
        error: {
          code: 405,
          message: "method not allowed"
        }
      });
      return;
    }

    let resource = await Resource.findOne({
      slug: req.query.slug
    }).lean();

    if (!resource) {
      res.status(404).json({
        data: null,
        error: {
          code: 404,
          message: "resource not found"
        }
      });
      return;
    }
    const user = await User.findOne({
      slug: req.headers.uid
    }).lean();

    if (user.role === "user" || user.role === "moderator") {
      if (resource.owner.uid !== req.headers.uid) {
        res.status(403).json({
          data: null,
          error: {
            code: 403,
            message: "forbidden"
          }
        });
        return;
      }
    }

    resource = await Resource.findOneAndDelete({
      slug: req.query.slug
    }).lean();

    // remove notifications

    const notificationsDeleted = await Notification.deleteMany({
      "document.slug": req.query.slug,
      $or: [{ type: "like" }, { type: "comment" }]
    });

    res.status(200).json({
      data: {
        type: "resource",
        id: resource._id,
        attributes: resource,
        extra: {
          notifications: notificationsDeleted
        }
      }
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "resource:slug/delete");
  }
}

export default withAuth(withDatabase(handler));
