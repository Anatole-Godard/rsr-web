import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Report from "@models/Report";
import { getUser } from "@utils/getCurrentUser";
import { handleError } from "@utils/handleError";
import { NextApiRequest, NextApiResponse } from "next";
import User from '@models/User';
import Resource from '@models/Resource';
import { ResourceMinimum } from '@definitions/Resource';
import { UserMinimum } from '@definitions/User';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({
            data  : null,
            error : {
                code    : 405,
                message : "method not allowed",
            },
        });
        return;
    }

    try {
        const { documentUid, type, context } = req.body;
        if (!documentUid || !type) {
            res.status(400).json({
                data  : null,
                error : {
                    code    : 400,
                    message : "bad request",
                    fields  : {
                        document : !documentUid,
                        type     : !type,
                    },
                },
            });
            return;
        }
        let document: ResourceMinimum | UserMinimum | {} = {};
        let validated = true;

        if (type === "user") {
            const reportedUser = await User.findOne({ _id : documentUid });
            validated = reportedUser.validated
            document           = {
                uid      : reportedUser._id.toString(),
                fullName : reportedUser.fullName,
                photoURL : reportedUser.photoURL,
            }
        } else if (type === "resource") {
            const reportedResource = await Resource.findOne({ slug : documentUid });
            validated = reportedResource.validated
            document               = {
                slug        : reportedResource.slug,
                owner       : reportedResource.owner,
                createdAt   : reportedResource.createdAt,
                description : reportedResource.description,
                tags        : reportedResource.tags,
                data        : {
                    type       : reportedResource.data.type,
                    attributes : {
                        properties : { name : reportedResource.data.attributes.properties.name },
                    },
                },
            };
        }

        if (!document) {
            return res.status(404).json({
                data  : null,
                error : {
                    message : type + " not found",
                    code    : 404,
                },
            });
        }

        const user = await getUser(req);
        if (!user) {
            res.status(401).json({
                data  : null,
                error : {
                    code    : 401,
                    message : "unauthorized",
                },
            });
            return;
        }

        const emitter = {
            fullName : user.fullName,
            photoURL : user.photoURL,
            uid      : user._id.toString(),
        }

        const report = await Report.create({
            document,
            emitter,
            type,
            context,
            validated,
        });
        res.status(201).json({
            data  : {
                message    : "ok",
                type       : "report",
                attributes : report,
                payload    : {
                    ...req.body,
                },
            },
            error : null,
        });
    } catch (error) {
        handleError(res, error, "report:create");
    }
}

export default withAuth(withDatabase(handler));
