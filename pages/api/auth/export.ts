import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";
import Notification from "@models/Notification";
import Resource from "@models/Resource";
import User from "@models/User";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid } = req.headers as { uid: string };
    if (!uid)
      return res.status(401).json({
        data: null,
        error: {
          code: 401,
          name: "MissingUidError",
          message: "Unauthorized",
        },
      });

    const user = await User.findOne({ uid }).select("-password, -__v");
    delete user.password;

    const resourcesLinked = await Resource.find({
      $or: [
        { "owner.uid": uid },
        { "members.uid": uid },
        { "comments.owner.uid": uid },
        { "likes.uid": uid },
      ],
    });

    const channelLinked = await Channel.find({
      $or: [
        { "owner.uid": uid },
        { "members.uid": uid },
        { "messages.user.uid": uid },
      ],
    });

    const notificationsLinked = await Notification.find({
      $or: [
        { "user.uid": uid },
        { "emitter.uid": uid },
        { "document.owner.uid": uid },
      ],
    });

    const data = {
      user,
      resources: {
        owner: resourcesLinked.filter((resource) => resource.owner.uid === uid),
        members: resourcesLinked.filter((resource) =>
          resource.members.some((member) => member.uid === uid)
        ),
        comments: resourcesLinked.filter((resource) =>
          resource.comments.some((comment) => comment.owner.uid === uid)
        ),
      },
      channels: {
        owner: channelLinked.filter((channel) => channel.owner.uid === uid),
        members: channelLinked.filter((channel) =>
          channel.members.some((member) => member.uid === uid)
        ),
        messages: channelLinked.filter((channel) =>
          channel.messages.some((message) => message.user.uid === uid)
        ),
      },
      notifications: {
        user: notificationsLinked.filter(
          (notification) => notification.user.uid === uid
        ),
        emitter: notificationsLinked.filter(
          (notification) => notification.emitter.uid === uid
        ),
        document: notificationsLinked.filter(
          (notification) => notification.document.owner.uid === uid
        ),
      },
    };

    return res.status(200).json({
      data,
      error: null,
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "auth/export");
  }
};
export default withAuth(withDatabase(handler));
