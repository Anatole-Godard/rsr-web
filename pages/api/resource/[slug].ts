import type { NextApiRequest, NextApiResponse } from "next";
import type { ResourceResponse } from "@definitions/Resource/ResourceResponse";
import { fakeResource } from "@utils/faker.dev";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResourceResponse>
) {
  try {
    res.status(200).json({
      data: {
        type: "resource",
        id: "1",
        attributes: fakeResource()
      },
    });
  } catch (err) {
    res.status(500).json({
      error: { code: 500, message: err instanceof Error ? err.message : "an error occured on resource:slug" },
    });
  }
}
