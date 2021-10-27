import type { ChannelInvite } from "@definitions/Channel/ChannelInvite";
import { fakeChannelInvite } from "@utils/faker.dev";
import type { NextApiRequest, NextApiResponse } from "next";

type ChannelInviteResponse =
  | {
      data: ChannelInvite;
    }
  | {
      error: string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChannelInviteResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const channelInvite: ChannelInvite = fakeChannelInvite();
    res.status(201).json({
      data: channelInvite,
    });
  } catch (e) {
    res.status(500).json({
      error:
        e instanceof Error
          ? e.message
          : "an error occured on channel-invite.create:fakeChannelInvite",
    });
  }
}
