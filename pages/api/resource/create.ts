import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: {
        code: 405,
        message: "method not allowed",
      },
    });
    return;
  }

  const {} = req.body;
}

export default withAuth(withDatabase(handler));
