import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import {
  PaperAirplaneIcon,
  PencilIcon,
  PlusIcon,
  XIcon,
} from "@heroicons/react/outline";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Message } from "@definitions/Message";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "@utils/fetchRSR";
import { Channel } from "@definitions/Channel/Channel";
import { HistoryItem } from "@components/channel/HistoryItem";

const ChannelSlug: NextPage<any> = ({
  sideBarChannels,
  channel,
}: {
  sideBarChannels: {
    slug: string;
    name: string;
    messages: {
      content: string;
      createdAt: string;
    }[];
    members: object[];
  }[];
  channel: Channel;
}) => {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<Message[]>(channel.messages || []);
  // const [connected, setConnected] = useState<boolean>(false);

  const inputRef = useRef<null | HTMLInputElement>();
  const bottomListRef = useRef<null | HTMLLIElement>();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const [history, setHistory] = useState<any[]>([]);

  useEffect((): any => {
    const socket = io("http://localhost:3000", {
      path: `/api/channel/[slug]/socket`,
    });

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      // setConnected(true);
    });

    // update chat on new message dispatched
    socket.on("message", (message: Message) => {
      console.log("MESSAGE RECEIVED", message);
      setChat((oldChat) => [...oldChat, message]);
    });

    if (socket) return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (msg: string) => {
    const message = {
      user: {
        fullName: user.data.fullName,
        photoURL: user.data.photoURL,
        uid: user.data.uid,
      },
      data: { type: "message", text: msg },
    };

    const resp = await fetchRSR(
      `/api/channel/${slug}/messages`,
      user?.session,
      {
        method: "POST",
        body: JSON.stringify(message),
      }
    );
    if (resp.ok) {
      setMessage("");
      if (bottomListRef.current)
        bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    sendMessage(message);
  };

  useEffect(() => {
    setHistory(
      [...chat, ...channel.activities].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );
  }, [chat, channel.activities]);

  useEffect(() => {
    if (bottomListRef.current)
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full md:flex-row">
        <Sidebar
          channels={sideBarChannels}
          canExpand
          isExpanded={false}
          canReturn
          selectedChannelSlug={slug as string}
        />
        <div className="flex justify-center w-full max-h-[calc(100%-6rem)] md:max-h-full h-full">
          <div className="flex flex-col w-full bg-gray-700">
            {/* HEADER */}
            <div className="inline-flex justify-between w-full p-3 px-6">
              <div className="flex flex-col ">
                <div className="inline-flex items-center">
                  <p className="text-xl font-medium text-gray-100 font-marianne">
                    {"#" + slug}
                  </p>
                  {/* <span className=" text-[0.6rem] ml-3 h-3 min-w-max w-full bg-gray-200 text-black font-bold rounded-full">
                    {chat.length}
                  </span> */}
                </div>
                {channel.description && (
                  <p className="text-sm font-light text-gray-300 font-spectral">
                    {channel.description}
                  </p>
                )}
              </div>
              <div className="inline-flex items-center space-x-3">
                <button className="btn-red">
                  <XIcon className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:block">Quitter le salon</span>
                </button>
                {user?.data.uid === channel.owner.uid && (
                  <Link href={`/channel/${slug}/edit`}>
                    <a className="btn-green">
                      <PencilIcon className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:block">Éditer le salon</span>
                    </a>
                  </Link>
                )}
                <Link href={"/resource/create" + `?channel=${slug}`}>
                  <a className="btn-blue">
                    <PlusIcon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:block">
                      Poster une ressource
                    </span>
                  </a>
                </Link>
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col p-3 px-6 space-y-4 overflow-y-auto bg-white grow lg:max-h-full xl:ml-6 xl:rounded-l-xl xl:p-6">
              <ol className="relative border-l border-gray-200 h-fit dark:border-gray-700">
                {history.map((item, index) => (
                  <HistoryItem
                    {...item}
                    key={index}
                    context={{ name: channel.name }}
                  />
                ))}
                <li ref={bottomListRef} />
              </ol>
            </div>

            {/* FOOTER */}
            <form
              onSubmit={handleSubmitMessage}
              className="inline-flex items-center w-full p-3 px-6"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="z-40 h-10 mr-2 input"
                ref={inputRef}
                placeholder="Écrivez votre message..."
              />
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 p-0 btn-blue"
              >
                <PaperAirplaneIcon className="w-5 h-5 " />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChannelSlug;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user },
  } = context.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  const channels = await (
    await fetch("http://localhost:3000/api/channel/")
  ).json();

  return {
    props: {
      sideBarChannels: channels?.data?.attributes?.map(
        (e: { slug: string; name: string; image?: { url: string } }) => ({
          slug: e.slug,
          name: e.name,
          photoURL: e.image?.url || "https://via.placeholder.com/150",
        })
      ),
      channel: channels?.data?.attributes?.find(
        (e: { slug: string }) => e.slug === context.params.slug
      ),
    },
  };
};

/*

*/
