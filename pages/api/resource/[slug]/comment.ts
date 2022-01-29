import { Notification } from "@definitions/Notification";
import { ResourceMinimum } from "@definitions/Resource";
import { Comment } from "@definitions/Resource/Comment";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import NotificationModel from "@models/Notification";
import Resource from "@models/Resource";
import { getUser } from "@utils/getCurrentUser";
import { handleError } from "@utils/handleError";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug as string;
  try {
    const commentContent: string = req.body.commentContent as string;
    const user = await getUser(req);
    if (!user) {
      return res.status(401).json({
        data: null,
        error: {
          code: 401,
          message: "unauthorized",
        },
      });
    }
    const comment: Comment = {
      content: commentContent,
      owner: {
        uid: user.uid.toString(),
        fullName: user.fullName,
        photoURL: user.photoURL,
      },
      createdAt: new Date(),
    };

    const resource = await Resource.findOne({ slug });

    if (!resource) {
      return res.status(404).json({
        data: null,
        error: {
          message: "Resource not found",
          code: 404,
        },
      });
    }

    resource.comments.push(comment);
    await resource.save();

    const resourceMinimum: ResourceMinimum = {
      slug: resource.slug,
      owner: resource.owner,
      createdAt: resource.createdAt,
      description: resource.description,
      tags: resource.tags,
      data: {
        type: resource.data.type,
        attributes: {
          properties: { name: resource.data.attributes.properties.name },
        },
      },
    };

    if (resource.owner.uid.toString() !== user.uid.toString()) {
      const notification: Notification = {
        type: "comment",
        document: resourceMinimum,
        user: {
          uid: user.uid.toString(),
          fullName: user.fullName,
          photoURL: user.photoURL,
        },
        createdAt: comment.createdAt,
      };
      await NotificationModel.create(notification);
    }

    res.status(200).json({
      data: {
        type: "comment",
        attributes: resource,
      },
    });
  } catch (err) {
    handleError(res, err, "resource/slug/comment");
  }
}

export default withAuth(withDatabase(handler));
