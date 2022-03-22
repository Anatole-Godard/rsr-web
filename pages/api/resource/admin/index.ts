import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "@utils/handleError";
import { getPagination, getTotalPages } from "@utils/pagination";
import { isAdmin } from '@utils/getCurrentUser';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!(await isAdmin(req, true))) {
      res.status(401).json({
        data: null,
        error: {
          code: 401,
          message: "unauthorized",
        },
      });
      return;
    }

    const param = req.query;
    const search = param.search;
    const { limit, offset } = getPagination(
      parseInt((param.page || 0).toString()),
      parseInt((param.limit || 3).toString())
    );
    let query = {};
    if (search && search.length > 0) {
      query = {
        $or: [
          { "owner.fullName": { $regex: `.*${search}.*` } },
          { "data.type": { $regex: `.*${search}.*` } },
          { slug: { $regex: `.*${search}.*` } },
        ],
      };
    }
    Resource.find(query)
      .skip(offset) //Notice here
      .limit(limit)
      .exec((err, resource) => {
        if (err) {
          return res.json(err);
        }
        Resource.countDocuments(query).exec((count_error, count) => {
          if (err) {
            handleError(res, err, "resource/all");
          }
          return res.status(200).json({
            data: {
              type: "resource",
              id: "all",
              totalItems: count,
              totalPages: getTotalPages(count, limit),
              attributes: resource.map((element) => ({
                uid: element._id,
                owner: element.owner,
                slug: element.slug,
                data: element.data,
                likes: element.likes,
                validated: element.validated,
                createdAt: element.createdAt,
                tags: element.tags,
              })),
            },
          });
        });
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

export default withDatabase(handler);
