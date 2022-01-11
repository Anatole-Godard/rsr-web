import {Server} from 'socket.io'
import Message from "@models/message"

import withDatabase from "@middleware/mongoose";

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
    console.log('Initializing chat')
    return await Message.find({});
}

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log('Starting socket.io')

        const io = new Server(res.socket.server)

        io.on('connection', async socket => {
            let messages = await getMessages();
            io.emit('get-messages', messages);
            socket.broadcast.emit('notification', 'New user connected')
        })

        res.socket.server.io = io
    } else {
        console.log('socket.io already running')

        const io = res.socket.server.io

        io.on('connection', async socket => {
            let messages = await getMessages();
            io.emit('get-messages', messages);
            socket.on('new-message', async message => {
                try {
                    await postMessage(message)
                    io.emit('res-new-message', message)
                } catch (e) {
                    io.emit('notification', e)
                }
            })

            socket.on('refresh-chat', async () => {
                try {
                    io.emit('get-messages', await getMessages());
                    console.log('chat refreshed')
                }
                catch (e) {
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

export default withDatabase(ioHandler)