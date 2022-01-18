import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/Socket";
import connectDB from "@middleware/mongoose";
import Message from "@models/Message"
import {Message as ChannelMessage} from "@definitions/Message"

const postMessage = async (msg: ChannelMessage) => {
    const msgObject = new Message({
        user: msg.user,
        text: msg.text,
        attachment: msg.attachment,
        channel: msg.channel
    });
    console.log("--- Message sent to DB ---")
    return await msgObject.save();
}

const getMessages = async (channel: string) => {
    console.log('--- Initializing chat ---')
    return Message.find({channel});
}

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (req.method === "POST") {
        // get message
        const message = req.body;

        // dispatch to channel "message"
        res?.socket?.server?.io?.emit("message", message);

        const msg = await postMessage(req.body)

        // return message
        res.status(201).json(msg);
    } else if (req.method === "GET"){
        const messages = await getMessages(req.query.slug.toString());
        res.status(200).json(messages);
    }
};

export default connectDB(handler)