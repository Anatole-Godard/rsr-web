import { NextApiRequest } from "next";
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from "http";
import { NextApiResponseServerIO} from "types/Socket";
import Message from "@models/Message"
import withDatabase from "@middleware/mongoose";

export const config = {
    api: {
        bodyParser: false
    }
}

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log('Starting socket.io')

        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {path: "/api/channel/[slug]/socket"})

        res.socket.server.io = io
    }
    res.end()
}