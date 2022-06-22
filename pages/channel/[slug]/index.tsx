import { Sidebar } from "@components/Channel/Sidebar";
import { AppLayout } from "@components/Layout/AppLayout";
import {
  ChatIcon,
  CheckIcon,
  PencilIcon,
  UserGroupIcon,
  XIcon,
} from "@heroicons/react/outline";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Message } from "@definitions/Message";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "libs/fetchRSR";
import { Channel } from "@definitions/Channel";
import { HistoryItem } from "@components/Channel/HistoryItem";
import Image from "next/image";
import { Activity } from "@definitions/Activity";

const ChannelSlug: NextPage<any> = ({
  sideBarChannels,
  channel,
}: {
  sideBarChannels: Channel[];
  channel: Channel;
}) => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<Message[]>(channel.messages || []);
  const [history, setHistory] = useState<(Message | Activity)[]>([]);

  const inputRef = useRef<null | HTMLInputElement>();
  const bottomListRef = useRef<null | HTMLLIElement>();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect((): any => {
    const socket = io("http://localhost:3000", {
      path: `/api/channel/[slug]/socket`,
    });

    socket.on("message", (message: Message) => {
      setChat((oldChat) => [...oldChat, message]);
    });

    if (socket)
      return () => {
        socket.disconnect();
      };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);

  useEffect(() => {
    setHistory(
      [...chat, ...channel.activities].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );

    return () => {
      setHistory([]);
    };
  }, [chat, channel.activities]);

  useEffect(() => {
    if (bottomListRef.current)
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const quit = async () => {
    const res = await fetchRSR(`/api/channel/${slug}/quit`, user?.session);
    if (res.ok) router.push("/channel");
  };

  const sendMessage = async (msg: string) => {
    const message = {
      user: {
        fullName: user.data.fullName,
        photoURL: user.data.photoURL,
        uid: user.data.uid,
      },
      data: { type: "message", text: msg },
    };

    const res = await fetchRSR(`/api/channel/${slug}/messages`, user?.session, {
      method: "POST",
      body: JSON.stringify(message),
    });
    if (res.ok) {
      setMessage("");
      if (bottomListRef.current)
        bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full md:flex-row">
        <Sidebar
          channels={sideBarChannels}
          selectedChannelSlug={slug as string}
        />
        <div className="flex justify-center w-full max-h-[calc(100%-6rem)] md:max-h-full h-full">
          <div className="flex flex-col w-full md:bg-gray-100 dark:md:bg-gray-900 ">
            {/* HEADER */}
            <div className="inline-flex justify-between w-full p-3 pr-6 border-b border-gray-100 dark:border-gray-900 md:border-0">
              <div className="inline-flex items-center">
                {channel.image ? (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full select-none md:w-8 md:h-8 bg-bleuFrance-50 ring-2 shrink-0 ring-offset-2 ring-bleuFrance-200">
                    <Image
                      src={channel.image.url}
                      alt={slug}
                      width={24}
                      height={24}
                    />
                  </div>
                ) : (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 md:w-8 md:h-8 text-bleuFrance-500 bg-bleuFrance-50 ring-2 ring-offset-2 ring-bleuFrance-200 dark:bg-bleuFrance-700 dark:text-bleuFrance-200">
                    <UserGroupIcon className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                  </span>
                )}

                <div className="flex flex-col ml-2">
                  <div className="inline-flex items-center">
                    <p className="text-xl font-medium text-gray-700 dark:text-gray-200 font-marianne">
                      {"#" + slug}
                    </p>
                    {/* <span className=" text-[0.6rem] ml-3 h-3 min-w-max w-full bg-gray-200 text-black font-bold rounded-full">
                    {chat.length}
                  </span> */}
                  </div>
                  {channel.description && (
                    <p className="text-xs font-light text-gray-500 font-spectral">
                      {channel.description.length > 70
                        ? channel.description.substring(0, 70) + "..."
                        : channel.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="inline-flex items-center pr-6 space-x-3 ">
                {user?.data.uid === channel.owner.uid && (
                  <Link
                    href={`/channel/${slug}/edit`}
                    key="channel_slug-edit_link"
                  >
                    <a
                      className="bg-gray-300 btn-gray hover:bg-gray-400 hover:text-gray-900 dark:hover:text-gray-300 shrink-0"
                      key="channel_slug-edit-btn"
                    >
                      <PencilIcon
                        className="w-4 h-4 sm:mr-2 shrink-0"
                        key="channel_slug-edit-icon"
                      />
                      <span className="items-center hidden sm:inline-flex">
                        Éditer{" "}
                        <span className="hidden ml-1 lg:inline-flex">
                          le salon
                        </span>
                      </span>
                    </a>
                  </Link>
                )}
                <button
                  className="btn-red shrink-0"
                  onClick={quit}
                  key="channel_slug-quit_btn"
                >
                  <XIcon
                    className="w-4 h-4 sm:mr-2 shrink-0"
                    key="channel_slug-quit_icon"
                  />
                  <span className="items-center hidden sm:inline-flex">
                    Quitter{" "}
                    <span className="hidden ml-1 lg:inline-flex">le salon</span>
                  </span>
                </button>
                {/* <Link
                  href={"/resource/create" + `?channel=${slug}`}
                  key="channel_slug-resource_link"
                >
                  <a
                    className="btn-bleuFrance shrink-0"
                    key="channel_slug-resource_btn"
                  >
                    <PlusIcon
                      className="w-4 h-4 sm:mr-2 shrink-0"
                      key="channel_slug-resource_icon"
                    />
                    <span className="items-center hidden sm:inline-flex">
                      Poster
                      <span className="hidden ml-1 lg:inline-flex">
                        une ressource
                      </span>
                    </span>
                  </a>
                </Link> */}
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col p-6 pr-6 space-y-4 overflow-y-auto bg-white dark:bg-gray-800 grow lg:max-h-full md:rounded-l-xl ">
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
              className="inline-flex items-center w-full px-6 py-3 md:pl-0"
            >
              <label className="relative w-full mr-2 text-gray-400 focus-within:text-gray-600 ">
                <ChatIcon className="absolute w-4 h-4 duration-300 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="z-40 pl-[2.25rem] bg-white hover:bg-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700 input"
                  ref={inputRef}
                  placeholder="Écrivez votre message..."
                />
              </label>
              <button type="submit" className=" btn-bleuFrance">
                <CheckIcon className="w-4 h-4 mr-2" />
                Envoyer
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
  let parsedUser = JSON.parse(user);
  const channels = await (
    await fetchRSR("http://localhost:3000/api/channel/", parsedUser?.session)
  ).json();

  const channel: Channel = (
    await (
      await fetchRSR(
        "http://localhost:3000/api/channel/" + context.params.slug,
        parsedUser?.session
      )
    ).json()
  )?.data?.attributes;

  if (!channel)
    return {
      redirect: {
        permanent: false,
        destination: "/channel",
      },
    };

  return {
    props: {
      sideBarChannels: channels?.data?.attributes,
      channel,
    },
  };
};
