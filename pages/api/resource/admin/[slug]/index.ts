import type { NextApiRequest, NextApiResponse } from "next";

type ApiResponse =
    | {
    data: {
        slug: string;
        validate: true;
    };
}
    | {
    data: {
        slug: string;
        deleted: true;
    };
}
    | {
    error: {
        code: number;
        message: string;
    };
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    const { action }: { action: "validate" | "delete" } = req.body;
    //   const { slug }: { slug: string } = req.query;
    const slug: string = "todo";
    switch (action) {
        case "validate":
            res.status(201).json({
                data: {
                    slug,
                    validate: true,
                },
            });
            break;
        case "delete":
            res.status(200).json({
                data: {
                    slug,
                    deleted: true,
                },
            });
            break;
        default:
            res.status(400).json({
                error: {
                    code: 400,
                    message: "Bad Request",
                },
            });
    }
}
