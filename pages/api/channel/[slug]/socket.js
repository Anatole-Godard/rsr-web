import {Server, Server as ServerIO} from 'socket.io'

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

        io.on('connection', socket => {
            socket.on('new-message', message => {
                io.emit('res-new-message', message)
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

export default ioHandler