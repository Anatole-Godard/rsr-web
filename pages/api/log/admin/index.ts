import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { getPagination, getTotalPages } from "libs/pagination";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdmin } from "libs/getCurrentUser";
import Log from "@models/Log";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!(await isAdmin(req))) {
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
      parseInt(<string>param.page) || 0,
      parseInt(<string>param.limit) || 3
    );
    let query = {};
    if (search && search.length > 0) {
      query = {
        $or: [
          { url: { $regex: `.*${search}.*` } },
          { location: { $regex: `.*${search}.*` } },
          { "user.fullName": { $regex: `.*${search}.*` } },
        ],
      };
    }

    Log.find(query)
      .skip(offset)
      .limit(limit)
      .exec((err, logs) => {
        if (err) {
          return res.json(err);
        }
        Log.countDocuments(query).exec((count_error, count) => {
          if (err) {
            // @ts-ignore
            handleError(res, err, "logs/all");
          }
          return res.status(200).json({
            data: {
              type: "log",
              id: "all",
              totalItems: count,
              totalPages: getTotalPages(count, limit),
              attributes: logs,
            },
          });
        });
      });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "logs/all");
  }
}

export default withAuth(withDatabase(handler));
