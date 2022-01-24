import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/Socket";
import connectDB from "@middleware/mongoose";
import Channel from "@models/Channel";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const slug = req.query.slug as string;
  const channel = await Channel.findOne({ slug });
  if (req.method === "POST") {
    const { user, data } = req.body;

    const msg = { user, data, createdAt: new Date().toISOString() };

    channel.messages.push(msg);
    await channel.save();

    res?.socket?.server?.io?.emit("message", msg);

    res.status(201).json(msg);
  } else if (req.method === "GET") {
    res.status(200).json(channel.messages);
  }
};

export default connectDB(handler);
