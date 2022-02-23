import type { NextApiRequest, NextApiResponse } from "next";
import Report from '@models/Report';
import User from '@models/User';
import Resource from '@models/Resource';
import { isAdmin } from '@utils/getCurrentUser';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {

        const uid: string | string[] = req.query.uid
        console.log(req.method === 'PUT', !(await isAdmin(req, true)))
        if (req.method === 'PUT') {
            if (!(await isAdmin(req, true))) {
                res.status(401).json({
                    data  : null,
                    error : {
                        code    : 401,
                        message : "unauthorized",
                    },
                });
                return;
            }

            const { validated }: { validated: Boolean } = req.body;
            const update                                = { validated };
            const currentReport                         = await Report.findOne({ _id : uid });
            let document                                = {}

            if (currentReport.type === "user") {
                await User.findOneAndUpdate({ _id : currentReport.document.uid }, update);
                document = await User.findOne({ _id : currentReport.document.uid });
            } else if (currentReport.type === "resource") {
                await Resource.findOneAndUpdate({ slug : currentReport.document.slug.toString() }, update);
                document = await Resource.findOne({ slug : currentReport.document.slug.toString() });
            }

            const newReport    = await Report.findOne({ _id : uid });
            newReport.document = document;
            newReport.validated = validated;
            await newReport.save();
            res.status(200).json({
                data : {
                    id         : newReport._id,
                    type       : "report",
                    attributes : newReport
                },
            });
        }
    } catch (err) {
        res.status(500).json({
            error : { code : 500, message : err instanceof Error ? err.message : "an error occured on report:uid" },
        });
    }
}
