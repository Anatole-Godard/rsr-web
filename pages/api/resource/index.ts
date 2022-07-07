import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { TagDocument } from "@definitions/Resource/Tag";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid = undefined } = req.headers as { uid: string | undefined };

  const { q: search = "", type = "" } = req.query;

  if (search || type) {
    const query = uid
      ? {
        $and: [
          {
            $or: [
              { $and: [{ validated: false }, { "owner.uid": uid }] },
              {
                $and: [
                  { visibility: "private" },
                  { "owner.uid": uid },
                  { validated: true }
                ]
              },
              {
                $and: [
                  { visibility: "unlisted" },
                  { "members.uid": uid },
                  { validated: true }
                ]
              },
              { $and: [{ visibility: "public" }, { validated: true }] }
            ]
          },
          ...(search
            ? [
              {
                $or: [
                  {
                    "data.attributes.properties.name": {
                      $regex: search,
                      $options: "i"
                    }
                  },
                  {
                    "tags.name": {
                      $regex: search,
                      $options: "i"
                    }
                  }
                ]
              }
            ]
            : []),
          ...(type
            ? [
              {
                "data.type": type
              }
            ]
            : [])
        ]
      }
      : {
        $and: [
          { visibility: "public" },
          { validated: true },
          ...(search
            ? [
              {
                $or: [
                  {
                    "data.attributes.properties.name": {
                      $regex: search,
                      $options: "i"
                    }
                  },
                  {
                    "tags.name": {
                      $regex: search,
                      $options: "i"
                    }
                  }
                ]
              }
            ]
            : []),
          ...(type
            ? [
              {
                "data.type": type
              }
            ]
            : [])
        ]
      };

    try {
      const resources = await Resource.find(query);

      res.status(200).json({
        data: {
          id: "search",
          type: "resource",
          attributes: resources.map((r) =>
            uid === r.owner.uid
              ? r.toObject()
              : {
                ...r.toObject(),
                tags: r.tags.filter((t: TagDocument) => t.validated)
              }
          )
        }
      });
    } catch (error) {
      // @ts-ignore
      handleError(res, error, "resource/search");
    }
  } else {
    try {
      const resources = await Resource.find({
        ...(uid
          ? {
            $or: [
              { "members.uid": uid },
              { "owner.uid": uid },
              { validated: true, visibility: "public" }
            ]
          }
          : { validated: true, visibility: "public" })
      });
      res.status(200).json({
        data: {
          id: "all",
          type: "resource",
          attributes: resources.map((r) =>
            uid === r.owner.uid
              ? r.toObject()
              : {
                ...r.toObject(),
                tags: r.tags.filter((t: TagDocument) => t.validated)
              }
          ),
          search: false
        }
      });
    } catch (err) {
      // @ts-ignore
      handleError(res, err, "resource/all");
    }
  }
}

export default withDatabase(handler);
