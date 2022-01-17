import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Resource from "@models/Resource";
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
    const {
      description,
      tags,
      data: { type, attributes },
    } = req.body;
    const {
      properties: { name },
    } = attributes;

    if (!description || !type || !attributes || !name) {
      res.status(400).json({
        data: null,
        error: {
          code: 400,
          message: "bad request",
        },
      });
      return;
    }

    const slugResource = slug(name, { lower: true });

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

    const resource = await Resource.create({
      slug: slugResource,
      description,
      tags,
      data: { type, attributes },
      owner: {
        fullName: user.fullName,
        photoURL: user.photoURL,
        uid: user.uid,
      },
    });

    res.status(201).json({
      data: {
        message: "ok",
        type: "resource",
        attributes: resource,
        payload: {
          ...req.body,
        },
      },
      error: null,
    });
  } catch (error) {
    handleError(res, error, "resource:create");
  }
}

export default withAuth(withDatabase(handler));
