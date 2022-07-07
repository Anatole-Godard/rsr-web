import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Notification from "@models/Notification";
import { getUser } from "libs/getCurrentUser";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid = req.query.uid as string;
  if (req.method === "GET") {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({
          data: null,
          error: {
            code: 401,
            message: "Unauthorized",
          },
        });
      }
      if (user._id.toString() != uid) {
        return res.status(403).json({
          data: null,
          error: {
            code: 403,
            message: "Forbidden",
            fields: {
              user,
            },
          },
        });
      }

      const notifications = await Notification.find({ "user.uid": uid });

      return res.status(200).json({
        data: { attributes: notifications },
        error: null,
      });
    } catch (err) {
      // @ts-ignore
      handleError(res, err, "user/notifications");
    }
  }

  if (req.method === "DELETE") {
    const notificationId = req.query.id as string;
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({
          data: null,
          error: {
            code: 401,
            message: "Unauthorized",
          },
        });
      }
      if (user._id.toString() != uid) {
        return res.status(403).json({
          data: null,
          error: {
            code: 403,
            message: "Forbidden",
            fields: {
              user,
            },
          },
        });
      }

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        "user.uid": uid,
      });
      if (!notification) {
        return res.status(404).json({
          data: null,
          error: {
            code: 404,
            message: "Not found",
          },
        });
      }

      const notifications = await Notification.find({ "user.uid": uid });

      return res.status(200).json({
        data: { attributes: notifications },
        error: null,
      });
    } catch (err) {
      // @ts-ignore
      handleError(res, err, "user/notifications/delete");
    }
  }

  return res.status(405).json({
    data: null,
    error: {
      code: 405,
      message: "Method Not Allowed",
    },
  });
}

export default withAuth(withDatabase(handler));
