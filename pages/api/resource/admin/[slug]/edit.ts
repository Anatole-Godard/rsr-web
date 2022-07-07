import type { NextApiRequest, NextApiResponse } from "next";
import resource from "@models/Resource";
import { isAdmin } from "libs/getCurrentUser";
import Report from "@models/Report";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    const slug: string | string[] = req.query.slug;

    if (req.method === "PUT") {
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

      const { action }: { action: "validate" } = req.body;
      let filter = {};
      let update = {};
      if (action === "validate") {
        const { validated }: { validated: boolean } = req.body;
        filter = { _id: slug };
        update = { validated };
        await Report.updateMany({ "document._id": slug.toString, type: "resource" }, update);
      }

      await resource.findOneAndUpdate(filter, update);
      const newResource = await resource.findOne(filter);
      res.status(200).json({
        data: {
          id: newResource._id,
          type: "resource",
          attributes: newResource
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      error: { code: 500, message: err instanceof Error ? err.message : "an error occured on resource:slug" }
    });
  }
}
