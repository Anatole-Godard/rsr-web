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
            let docId                                   = ''

            if (currentReport.type === "user") {
                docId = currentReport.document.uid.toString()
                await User.findOneAndUpdate({ _id : docId }, update);
                await Report.updateMany({ 'document._id' : docId, type : currentReport.type }, update);

            } else if (currentReport.type === "resource") {
                docId = currentReport.document.slug.toString();
                await Resource.findOneAndUpdate({ slug : docId }, update);
                await Report.updateMany({ 'document.slug' : docId, type : currentReport.type }, update);
            }

            const newReport     = await Report.findOne({ _id : uid, type : currentReport.type });
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
