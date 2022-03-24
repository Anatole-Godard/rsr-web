import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";
import { fakeChannelInvite } from "@utils/faker.dev";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const channelInvite = fakeChannelInvite();

  if (req.method === "GET") {
    res.status(200).json({
      data: {},
      error: null,
    });
  } else if (req.method === "POST") {
    res.status(201).json({
      data: {
        attributes: channelInvite,
      },
      error: null,
    });
  } else {
    res.status(405).json({
      data: null,
      error: {
        code: 405,
        message: "method not allowed",
      },
    });
  }
}

export default withAuth(withDatabase(handler));
