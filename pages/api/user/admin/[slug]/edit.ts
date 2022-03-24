import type { NextApiRequest, NextApiResponse } from "next";
import User from '@models/User';
import Report from '@models/Report';
import { isAdmin } from '@utils/getCurrentUser';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {

        const slug: string | string[] = req.query.slug

        if (req.method === 'PUT') {
            if (!(await isAdmin(req))) {
                res.status(401).json({
                    data  : null,
                    error : {
                        code    : 401,
                        message : "unauthorized",
                    },
                });
                return;
            }

            const { action, }: { action: "validate" | "change-role" } = req.body;
            const filter                                              = { _id : slug }
            let update                                                = {}
            if (action === 'change-role') {
                const { role }: { role: "user" | "moderator" | "admin" | "superadmin" } = req.body;
                update                                                                  = { role };

            } else if (action === 'validate') {
                const { validated }: { validated: Boolean } = req.body;
                update                                      = { validated };
               await Report.updateMany({ 'document._id' : slug.toString, type:'user' }, update);
            }

            await User.findOneAndUpdate(filter, update);
            const newUser = await User.findOne(filter);
            res.status(200).json({
                data : {
                    id         : newUser._id,
                    type       : "user",
                    attributes : newUser
                },
            });
        }
    } catch (err) {
        res.status(500).json({
            error : { code : 500, message : err instanceof Error ? err.message : "an error occured on resource:slug" },
        });
    }
}
