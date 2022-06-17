import { Notification } from "@definitions/Notification";
import { ResourceMinimum } from "@definitions/Resource";
import { Comment } from "@definitions/Resource/Comment";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import NotificationModel from "@models/Notification";
import Resource from "@models/Resource";
import { getUser } from "libs/getCurrentUser";
import { handleError } from "libs/handleError";
import { toResourceMinimum } from "libs/toMinimum";
import { NextApiRequest, NextApiResponse } from "next";
import {UserMinimum} from "@definitions/User";
import {TagDocument} from "@definitions/Resource/Tag";

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
        uid: user._id.toString(),
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
    resource.markModified("comments");
    await resource.save();

    const resourceMinimum: ResourceMinimum

    if (resource.owner.uid.toString() !== user._id.toString()) {
      const notification: Notification = {
        type: "comment",
        document: resourceMinimum,
        user: {
          uid: resource.owner.uid.toString(),
          fullName: resource.owner.fullName,
          photoURL: resource.owner.photoURL,
        },
        createdAt: comment.createdAt,
        emitter: {
          uid: user._id.toString(),
          fullName: user.fullName,
          photoURL: user.photoURL,
        },
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
