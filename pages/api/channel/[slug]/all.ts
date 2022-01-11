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
    return await msgObject.save();
}

const getMessages = async (channel: string) => {
    console.log('Initializing chat')
    return Message.find({channel});
}

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (req.method === "POST") {
        // get message
        const message = req.body;

        // dispatch to channel "message"
        res?.socket?.server?.io?.emit("message", message);

        postMessage(req.body).then((e) => console.log("--- Message sent to DB ---"))
        // return message
        res.status(201).json(message);
    } else if (req.method === "GET"){
        const messages = await getMessages(req.query.slug.toString());
        console.log("Messages: " + JSON.stringify(messages));
        res.status(200).json(messages);
    }
};

export default connectDB(handler)