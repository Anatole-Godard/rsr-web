import type { NextApiRequest, NextApiResponse } from "next";
import type { ResourceResponse } from "@definitions/Resource/ResourceResponse";
import resource from '@models/Resource';
import { isAdmin } from '@utils/getCurrentUser';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResourceResponse>
) {
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

        const slug: string | string[] = req.query.slug

        if (req.method === 'PUT') {
            const { action }: { action: "validate" } = req.body;
            let filter                               = {}
            let update                               = {}
            if (action === 'validate') {
                const { validated }: { validated: Boolean } = req.body;
                filter                                      = { _id : slug };
                update                                      = { validated };
            }

            await resource.findOneAndUpdate(filter, update);
            const newResource = await resource.findOne(filter);
            res.status(200).json({
                data : {
                    id         : newResource._id,
                    type       : "resource",
                    attributes : newResource
                },
            });
        }
    } catch (err) {
        res.status(500).json({
            error : { code : 500, message : err instanceof Error ? err.message : "an error occured on resource:slug" },
        });
    }
}
