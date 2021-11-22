import {AppLayout} from "@components/layouts/AppLayout";
import {ArrowRightIcon} from "@heroicons/react/outline";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {NextPage} from "next";
import {useTheme} from "next-themes";
import Link from "next/link";
import {SetStateAction, useEffect, useState} from "react";
import io, {Socket} from 'socket.io-client'

const Channels: NextPage = () => {
    const {theme, setTheme} = useTheme();
    const [messageValue, setMessageValue] = useState("")
    const [socket, setSocket] = useState<null | Socket<DefaultEventsMap, DefaultEventsMap>>()
    const [chat, setChat] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/channel/slug/socket').finally(() => {
            setSocket(io())

            if (socket) {
                socket.on('connect', () => {
                    console.log('connect')
                    socket.emit('hello')
                })

                socket.on('hello', data => {
                    console.log('hello', data)
                })

                socket.on('a user connected', () => {
                    console.log('a user connected')
                })

                socket.on('disconnect', () => {
                    console.log('disconnect')
                })

                socket.on('new-message', (message: string) => {
                    console.log(message)
                })
            }
        })
    }, [])

    const updateMessageValue = (e: { target: { value: SetStateAction<string>; }; }) => {
        setMessageValue(e.target.value)
    }

    const sendMessage = async (message: string) => {
        if (socket) {
            socket.emit('new-message', message)
            setMessageValue("");
        }
        chat.push(message)
        setChat([...chat])
        console.log(chat)
    }

    const handleSubmitMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        sendMessage(messageValue)
    }

    return (
        <AppLayout>
            {/* TODO: Sidebar to navigate between different channels */}
            <div>
                <div className="bg-gray-100 py-5 px-5">
                    <span className="font-marianne uppercase font-bold px-3">Nom de la personne</span>
                    {/* TODO: Dynamic resource depending on user state */}
                    <span className="text-green-300">Connected</span>
                    <span className="text-rougeMarianne-500">Disconnected</span>
                </div>
                <div className="flex flex-col">
                    <div className=" mt-5 mx-10 sm-rounded bg-gray-100 max-w-max w-full p-2 rounded-md">
                        <span>message reçu</span>
                    </div>
                    <span className="text-gray-300 text-xs mx-10">26/10/2021 - 11:50</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="mt-5 mx-10 sm-rounded bg-gray-100 max-w-max w-full p-2 rounded-md">
                        <span>message envoyé</span>
                    </div>
                    <span className="text-gray-300 text-xs mx-10">26/10/2021 - 11:55</span>
                </div>
                {chat.map((chat, i) => (
                    <div key={"msg_" + i} className="mt-1">
                        {chat}
                    </div>
                ))}
                <div className="flex align-end">
                    <form onSubmit={handleSubmitMessage}>
                        <input
                            type="text"
                            name="gift"
                            id="gift"
                            value={messageValue}
                            onChange={updateMessageValue}
                            className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-600 rounded-md"
                        />
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}

export default Channels