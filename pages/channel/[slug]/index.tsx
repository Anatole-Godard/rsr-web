import { ChannelResource } from "@components/channel/Resource";
import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import {
  PaperAirplaneIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { fakeResource } from "@utils/faker.dev";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { Resource } from "@definitions/Resource";

const ChannelSlug: NextPage<any> = ({
  sideBarChannels,
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
}) => {
  const router = useRouter();
  const { slug } = router.query;

  const description = "Hello world";

  const [message, setMessage] = useState<string>("");

  const [resources, setResources] = useState<Resource[]>([
    fakeResource(),
    fakeResource(),
  ]);

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full max-h-[calc(100vh-4rem)] xl:flex-row ">
        <Sidebar
          channels={sideBarChannels}
          canExpand
          isExpanded={false}
          canReturn
          selectedChannelSlug={slug as string}
        />
        <div className="flex justify-center w-full h-full">
          <div className="flex flex-col w-full h-full bg-gray-700">
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
                {description && (
                  <p className="text-sm font-light text-gray-300 font-spectral">
                    {description}
                  </p>
                )}
              </div>
              <div className="inline-flex items-center space-x-3">
                <Link href={`/channel/${slug}/edit`}>
                  <a className="btn-green">
                    <PencilIcon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:block">Éditer le salon</span>
                  </a>
                </Link>
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
            <div className="flex flex-col max-h-[65vh] md:max-h-full  p-3 space-y-4 overflow-y-auto bg-white xl:ml-6 xl:rounded-l-xl xl:p-6">
              {resources.map((e, key) => (
                <ChannelResource {...e} key={key} />
              ))}
            </div>

            {/* FOOTER */}
            <div className="inline-flex items-center w-full p-3 px-6">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="z-40 mr-2 input"
              ></input>
              <button className="btn-blue">
                <PaperAirplaneIcon className="w-[1.25rem] h-[1.25rem] " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChannelSlug;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      sideBarChannels: [
        {
          slug: "general",
          name: "General",
          photoURL: "https://picsum.photos/200",
        },
        {
          slug: "random",
          name: "Random",
          photoURL: "https://picsum.photos/201",
        },
        {
          slug: "cool",
          name: "Cool",
          photoURL: "https://picsum.photos/202",
        },
        {
          slug: "fun",
          name: "Fun",
          photoURL: "https://picsum.photos/203",
        },
      ],
    },
  };
};
