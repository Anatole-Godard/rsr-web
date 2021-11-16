import {Server} from 'socket.io'
import Message from "@models/message"

import connectDB from "@middleware/mongoose";

const postMessage = async (message) => {
    const msg = new Message({
        user: {
            fullName: "John Doe",
            photoURL: "https://avatars3.githubusercontent.com/u/1234?s=460&v=4",
            uid: "1234567890",
        },
        text: message,
        createdAt: Date.now()
    });
    console.log(msg)
    return await msg.save();
}

const getMessages = async () => {
    return await Message.find({});
}

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log('Starting socket.io')

        const io = new Server(res.socket.server)

        io.on('connection', socket => {
            socket.broadcast.emit('notification', 'New user connected')
        })

        res.socket.server.io = io
    } else {
        console.log('socket.io already running')

        const io = res.socket.server.io

        io.on('connection', async socket => {
            socket.on('new-message', async message => {
                try {
                    await postMessage(message)
                    io.emit('res-new-message', message)
                } catch (e) {
                    io.emit('notification', e)
                }
            })

            let messages = await getMessages();
            io.emit('get-messages', messages);

            socket.on('disconnect', () => {
                socket.broadcast.emit('notification', 'User disconnected')
            });
        })
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default connectDB(ioHandler)