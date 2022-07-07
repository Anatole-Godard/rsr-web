import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { getPagination, getTotalPages } from "libs/pagination";
import { isAdmin } from "libs/getCurrentUser";
import Tag from "@models/Tag";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req, true)))
    return res.status(401).json({
      data: null,
      error: {
        code: 401,
        message: "unauthorized"
      }
    });

  try {
    if (req.method === "GET") {
      const param = req.query;
      const search = param.search;
      const { limit, offset } = getPagination(
        parseInt(<string>param.page) || 0,
        parseInt(<string>param.limit) || 3
      );
      let query = {};
      if (search && search.length > 0) {
        query = {
          $or: [
            { "owner.fullName": { $regex: `.*${search}.*` } },
            { name: { $regex: `.*${search}.*` } }
          ]
        };
      }
      const tags = await Tag.find(query)
        .skip(offset) //Notice here
        .limit(limit)
        .select("-__v");

      return res.status(200).json({
        data: {
          type: "resource",
          id: "tags",
          totalItems: tags.length,
          totalPages: getTotalPages(tags.length, limit),
          attributes: tags
        }
      });
    } else if (req.method === "PUT") {
      const tag = await Tag.findByIdAndUpdate(req.body._id, {
        validated: req.body.validated
      });
      const resources = await Resource.updateMany(
        { tags: { $elemMatch: { _id: tag._id } } },
        { $set: { "tags.$.validated": req.body.validated } }
      );

      return res.status(201).json({
        data: {
          type: "resource",
          id: "tags",
          attributes: await Tag.findById(req.body._id),
          resourcesModified: resources.modifiedCount
        }
      });
    } else if (req.method === "DELETE") {
      const tag = await Tag.findByIdAndDelete(req.body._id);
      const resources = await Resource.updateMany(
        { tags: { $elemMatch: { _id: tag._id } } },
        // @ts-ignore
        { $pull: { tags: { _id: tag._id } } }
      );

      return res.status(200).json({
        data: {
          type: "resource",
          id: "tags",
          attributes: tag,
          resourcesModified: resources.modifiedCount
        }
      });
    }
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "resource/admin/tags");
  }
}

export default withDatabase(handler);
