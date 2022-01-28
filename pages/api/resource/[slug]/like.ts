import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Notification from "@models/Notification";
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

    // const resource = await Resource.findOneAndUpdate(
    //   { slug },
    //   {
    //     $push: {
    //       likes: {
    //         uid: user._id,
    //         fullName: user.fullName,
    //         photoURL: user.photoURL,
    //       },
    //     },
    //   }
    // );

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

    console.log(resource.likes);
    if (resource.likes.find((like) => like.uid === user._id)) {
      resource.likes = resource.likes.filter((like) => like.uid !== user._id);
    } else {
      resource.likes.push({
        uid: user._id,
        fullName: user.fullName,
        photoURL: user.photoURL,
      });
      const ownerNotification = await Notification.create({
        type: "like",
        document: resource,
        user: {
          uid: user._id,
          fullName: user.fullName,
          photoURL: user.photoURL,
        },
      });
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
