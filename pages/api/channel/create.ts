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
    const { description, members, name, photoURL, visibility } = req.body;

    if (!description || !name || !members || members.length < 1) {
      res.status(400).json({
        data: null,
        error: {
          code: 400,
          message: "bad request",
          fields: {
            description: !description,
            members: !members || members.length < 1,
            name: !name,
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
          uid: user.uid,
        },
      ],
      visibility,
      description,
      owner: {
        fullName: user.fullName,
        photoURL: user.photoURL,
        uid: user.uid,
      },
    });

    res.status(201).json({
      data: {
        message: "ok",
        type: "channel",
        attributes: {
          channel,
        },
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
