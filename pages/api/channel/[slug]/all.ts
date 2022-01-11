import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/Socket";
import connectDB from "@middleware/mongoose";
import Message from "@models/Message"
import {fakeUserMin} from "@utils/faker.dev";
import {log} from "util";

const postMessage = async (msg: string) => {
    const msgObject = new Message({
        user: fakeUserMin(),
        text: msg,
        createdAt: Date.now()
    });
    return await msgObject.save();
}

const getMessages = async () => {
    console.log('Initializing chat')
    return Message.find({});
}

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (req.method === "POST") {
        // get message
        const message = req.body;

        // dispatch to channel "message"
        res?.socket?.server?.io?.emit("message", message);

        postMessage(req.body.text).then((e) => console.log("--- Message sent to DB ---"))
        // return message
        res.status(201).json(message);
    } else if (req.method === "GET"){
        const messages = await getMessages();
        console.log("Messages: " + JSON.stringify(messages));
        res.status(200).json(messages);
    }
};

export default connectDB(handler)