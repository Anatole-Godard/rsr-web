import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import User from "@models/User";
import { handleError } from "@utils/handleError";
import { getPagination, getTotalPages } from "@utils/pagination";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const param             = req.query;
        const search            = param.search
        const { limit, offset } = getPagination(
            parseInt(<string>param.page) || 0,
            parseInt(<string>param.limit) || 3
        );
        let query               = {};
        if (search && search.length > 0) {
            query = {
                $or : [
                    { email : { $regex : `.*${search}.*` } },
                    { fullName : { $regex : `.*${search}.*` } },
                ]
            }
        }

        User.find(query)
            .skip(offset)
            .limit(limit)
            .exec((err, user) => {
                if (err) {
                    return res.json(err);
                }
                User.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        handleError(res, err, "user/all");
                    }
                    return res.status(200).json({
                        data : {
                            type       : "user",
                            id         : "all",
                            totalItems : count,
                            totalPages : getTotalPages(count, limit),
                            attributes : user.map((element) => ({
                                uid        : element._id,
                                fullName   : element.fullName,
                                email      : element.email,
                                photoURL   : element.photoURL,
                                role       : element.role,
                                validated : element.validated,
                            })),
                        }
                    });
                });
            });
    } catch (err) {
        handleError(res, err, "user/all");
    }
}

export default withAuth(withDatabase(handler));
