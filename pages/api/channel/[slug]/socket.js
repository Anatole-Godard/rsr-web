import {Server} from 'socket.io'
import Message from "@models/message"

import connectDB from "@middleware/mongoose";

const newMessage = async (message) => {
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

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log('Starting socket.io')

        const io = new Server(res.socket.server)

        io.on('connection', socket => {
            socket.broadcast.emit('notification', 'New user connected');
            console.log(messages)
        })

        res.socket.server.io = io
    } else {
        console.log('socket.io already running')

        const io = res.socket.server.io

        io.on('connection', socket => {
            socket.on('new-message', async message => {
                try {
                    await newMessage(message)
                    io.emit('res-new-message', message)
                } catch (e) {
                    io.emit('notification', e)
                }
            })

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