import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/Socket";
import connectDB from "@middleware/mongoose";
import Channel from "@models/Channel";
import NotificationModel from "@models/Notification";
import { Notification } from "@definitions/Notification";
import { UserMinimum } from "@definitions/User";
import { ChannelMinimum } from "@definitions/Channel";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const slug = req.query.slug as string;
  const channel = await Channel.findOne({ slug });
  if (req.method === "POST") {
    const { user, data } = req.body;

    const msg = { user, data, createdAt: new Date().toISOString() };

    channel.messages.push(msg);
    await channel.save();

    const channelMin: ChannelMinimum = {
      visibility: channel.visibility,
      owner: channel.owner,
      name: channel.name,
      slug: channel.slug,
      createdAt: channel.createdAt,
      image: channel.image,
      description: channel.description
    };

    const notifications: Notification[] = channel.members
      .filter((u: UserMinimum) => u.uid.toString() !== user.uid.toString())
      .map((u: UserMinimum) => ({
        user: {
          uid: u.uid.toString(),
          fullName: u.fullName,
          photoURL: u.photoURL,
        },
        emitter: {
          uid: user.uid.toString(),
          fullName: user.fullName,
          photoURL: user.photoURL,
        },
        document: channelMin,
        type: "message",
        createdAt: msg.createdAt,
      }));


    await NotificationModel.insertMany(notifications);

    res?.socket?.server?.io?.emit("message", msg);

    res.status(201).json(msg);
  } else if (req.method === "GET") {
    res.status(200).json(channel.messages);
  }
};

export default connectDB(handler);
