import type { NextApiRequest, NextApiResponse } from "next";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { getPagination, getTotalPages } from "libs/pagination";
import { isAdmin } from 'libs/getCurrentUser';
import Report from '@models/Report';

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
      parseInt(<string>param.page) || 0,
      parseInt(<string>param.limit) || 3
    );
    let query = {};
    if (search && search.length > 0) {
      query = { "emitter.fullName": { $regex: `.*${search}.*` } };
    }

    Report.find(query)
      .skip(offset) //Notice here
      .limit(limit)
      .exec((err, report) => {
        if (err) {
          return res.json(err);
        }
        Report.countDocuments(query).exec((count_error, count) => {
          if (err) {
            // @ts-ignore
            handleError(res, err, "report/all");
          }
          return res.status(200).json({
            data: {
              type: "report",
              id: "all",
              totalItems: count,
              totalPages: getTotalPages(count, limit),
              attributes: report.map((element) => ({
                uid: element._id,
                emitter: element.emitter,
                document: element.document,
                type: element.type,
                message: element.message,
                link: element.link,
                validated: element.validated,
                context: element.context,
              }))
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
            : "an error occured on report:all",
      },
    });
  }
}

export default withDatabase(handler);
