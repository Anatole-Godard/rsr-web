import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "types/Socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  // const slug = req.query.slug as string;
  if (!res.socket.server.io) {
    // console.log("Starting socket.io");

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, { path: `/api/channel/[slug]/socket` });


    res.socket.server.io = io;
  }
  res.end();
}
