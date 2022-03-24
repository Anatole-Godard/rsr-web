import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";
import { getUser } from "@utils/getCurrentUser";
import { handleError } from "@utils/handleError";
import { NextApiRequest, NextApiResponse } from "next";
import slug from "slug";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({
      data: null,
      error: {
        code: 405,
        message: "method not allowed",
      },
    });
    return;
  }

  try {
    const { description, members, name, visibility } = req.body;

    if (
      !description ||
      !name ||
      (visibility === "private" && (!members || members.length < 1))
    ) {
      res.status(400).json({
        data: null,
        error: {
          code: 400,
          message: "bad request",
          fields: {
            description: !description ? "missing" : description,
            members:
              visibility === "private" && (!members || members.length < 1)
                ? "missing"
                : members,
            name: !name ? "missing" : name,
          },
        },
      });
      return;
    }

    const slugChannel = slug(name, { lower: true });

    const user = await getUser(req);
    if (!user) {
      res.status(401).json({
        data: null,
        error: {
          code: 401,
          message: "unauthorized",
        },
      });
      return;
    }

    const channel = await Channel.create({
      slug: slugChannel,
      name,
      members: [
        ...members,
        {
          fullName: user.fullName,
          photoURL: user.photoURL,
          uid: user._id.toString(),
        },
      ],
      visibility,
      description,
      owner: {
        fullName: user.fullName,
        photoURL: user.photoURL,
        uid: user._id.toString(),
      },
    });

    res.status(201).json({
      data: {
        message: "ok",
        type: "channel",
        attributes: channel,
        payload: {
          ...req.body,
        },
      },
      error: null,
    });
  } catch (error) {
    handleError(res, error, "channel:create");
  }
}

export default withAuth(withDatabase(handler));
