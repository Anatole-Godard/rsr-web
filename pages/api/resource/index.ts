import type { NextApiRequest, NextApiResponse } from "next";
// import type { ResourceResponse } from "@definitions/Resource/ResourceResponse";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search = "" } = req.query;
  if (search !== "") {
    res.status(200).json({
      data: {
        id: "all",
        type: "resource",
        attributes: [],
        search: true,
      },
    });
  } else {
    try {
      const resources = await Resource.find({});
      res.status(200).json({
        data: {
          id: "all",
          type: "resource",
          attributes: resources,
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
