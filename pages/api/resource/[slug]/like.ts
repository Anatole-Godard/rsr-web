import { Notification } from "@definitions/Notification";
import { ResourceMinimum } from "@definitions/Resource";
import { UserMinimum } from "@definitions/User";
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
    const user = JSON.parse(JSON.stringify(await getUser(req)));

    if (!user) {
      return res.status(401).json({
        data: null,
        error: {
          code: 401,
          message: "unauthorized",
        },
      });
    }

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

    if (
      resource.likes.find(
        (like: UserMinimum) => like.uid === user._id.toString()
      )
    ) {
      resource.likes = resource.likes.filter(
        (like: UserMinimum) => like.uid !== user._id.toString()
      );
    } else {
      resource.likes.push({
        uid: user._id.toString(),
        fullName: user.fullName,
        photoURL: user.photoURL,
      });

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
        validated: resource.validated,
        visibility: resource.visibility,
      };

      if (resource.owner.uid.toString() !== user._id.toString()) {
        const notification: Notification = {
          type: "like",
          document: resourceMinimum,
          emitter: {
            uid: user._id.toString(),
            fullName: user.fullName,
            photoURL: user.photoURL,
          },
          user: {
            uid: resource.owner.uid.toString(),
            fullName: resource.owner.fullName,
            photoURL: resource.owner.photoURL,
          },
          createdAt: new Date(),
        };

        await NotificationModel.create(notification);
      }
    }
    await resource.save();

    res.status(200).json({
      data: {
        type: "like",
        attributes: resource,
      },
    });
  } catch (err) {
    handleError(res, err, "resource/slug/like");
  }
}

export default withAuth(withDatabase(handler));
