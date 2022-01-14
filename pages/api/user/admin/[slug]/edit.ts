import type { NextApiRequest, NextApiResponse } from "next";
import type { ResourceResponse } from "@definitions/Resource/ResourceResponse";
import user from '@models/User';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResourceResponse>
) {
    try {
        const slug: string | string[] = req.query.slug

        if (req.method === 'PUT') {
            const { action, }: { action: "validate" | "change-role" } = req.body;
            if (action === 'change-role') {
                const { role }: { role: "user" | "moderator" | "admin" | "superadmin" } = req.body;

                const filter = { _id : slug };
                const update = { role };
                await user.findOneAndUpdate(filter, update);
                const newUser = await user.findOne(filter);
                console.log('newUser', newUser, slug)
                res.status(200).json({
                    data : {
                        id         : newUser._id,
                        type       : "user",
                        attributes : newUser
                    },
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            error : { code : 500, message : err instanceof Error ? err.message : "an error occured on resource:slug" },
        });
    }
}
