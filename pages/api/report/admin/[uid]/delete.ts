import type { NextApiRequest, NextApiResponse } from "next";
import Report from "@models/Report";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { withAuth } from "@middleware/auth";
import { isAdmin } from "libs/getCurrentUser";
import { Notification } from "@definitions/Notification";
import NotificationModel from "@models/Notification";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const uid: string | string[] = req.query.uid;
    if (req.method === "DELETE") {
      if (!(await isAdmin(req, true))) {
        res.status(401).json({
          data: null,
          error: {
            code: 401,
            message: "unauthorized"
          }
        });
        return;
      }

      const report = await Report.findOne({
        _id: uid
      });

      if (!report) {
        res.status(404).json({
          data: null,
          error: {
            code: 404,
            message: "report not found"
          }
        });
        return;
      }
      let filter = {};
      if (report.type === "user") {
        filter = { "document.uid": report.document.uid.toString(), type: report.type };
      } else if (report.type === "resource") {
        filter = { "document.slug": report.document.slug.toString(), type: report.type };
      }
      const reports = await Report.find(filter);
      reports.map(async (report) => {
        const notification: Notification = {
          type: "report",
          user: report.emitter,
          createdAt: new Date
        };
        await NotificationModel.create(notification);
      });
      await Report.deleteMany(filter);

      res.status(200).json({
        data: {
          type: "report",
          id: report._id,
          attributes: report
        }
      });
    }
  } catch
    (err) {
    // @ts-ignore
    handleError(res, err, "report:slug/delete");
  }
}

export default withAuth(withDatabase(handler));
