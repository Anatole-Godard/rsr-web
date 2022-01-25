import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "@utils/handleError";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q = "", type = "" } = req.query;
  if (q !== "" || (type !== "" && type !== "null")) {
    try {
      const query =
        q !== "" && type !== "" && type !== "null"
          ? {
              $and: [
                {
                  "data.attributes.properties.name": {
                    $regex: q,
                    $options: "i",
                  },
                },
                { "data.type": { $regex: type, $options: "i" } },
              ],
            }
          : q !== ""
          ? {
              "data.attributes.properties.name": {
                $regex: q,
                $options: "i",
              },
            }
          : { "data.type": { $regex: type, $options: "i" } };

      const resources = await Resource.find(query);

      res.status(200).json({
        data: {
          id: "search",
          type: "resource",
          attributes: resources,
        },
      });
    } catch (error) {
      handleError(res, error, "resource/search");
    }
  } else {
    try {
      const resources = await Resource.find({
        validated: true,
      });
      res.status(200).json({
        data: {
          id: "all",
          type: "resource",
          attributes: resources,
          search: false,
        },
      });
    } catch (err) {
      res.status(500).json({
        error: {
          code: 500,
          message:
            err instanceof Error
              ? err.message
              : "an error occured on resource:all",
        },
      });
    }
  }
}

export default withDatabase(handler);
