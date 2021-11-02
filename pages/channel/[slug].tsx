import { ChannelResource } from "@components/channel/Resource";
import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import { PlusIcon } from "@heroicons/react/outline";
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
    <AppLayout sidebar={{ size: "small" }}>
      <div className="flex flex-col w-full h-full xl:flex-row ">
        <Sidebar
          channels={sideBarChannels}
          canExpand
          isExpanded={false}
          canReturn
          selectedChannelSlug={slug as string}
        />
        <div className="flex justify-center w-full h-full xl:p-6">
          <div className="flex flex-col w-full mx-auto bg-gray-700 xl:shadow xl:mx-12 xl:rounded-xl">
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
                <Link href={"/resource/create" + `?channel=${slug}`}>
                  <a className="inline-flex items-center px-4 py-2 text-sm font-light text-blue-600 transition-all duration-300 bg-blue-200 rounded-lg hover:bg-blue-300 active:bg-blue-100 font-spectral">
                    <PlusIcon className="w-4 h-4 mr-2" /> Poster une ressource
                  </a>
                </Link>
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col p-3 xl:p-6 space-y-4 overflow-y-auto  bg-white h-[36rem] xl:rounded-xl">
              {resources.map((e, key) => (
                <ChannelResource {...e} key={key} />
              ))}
            </div>

            {/* FOOTER */}
            <div className="inline-flex justify-between w-full p-3 px-6">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="z-40 w-full px-3 py-2 text-sm font-light text-gray-600 transition-all duration-300 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-100 font-spectral"
              ></input>
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
        {
          slug: "programming",
          name: "Programming",
          photoURL: "https://picsum.photos/204",
        },
        {
          slug: "javascript",
          name: "Javascript",
          photoURL: "https://picsum.photos/205",
        },
        {
          slug: "typescript",
          name: "Typescript",
          photoURL: "https://picsum.photos/206",
        },
        {
          slug: "react",
          name: "React",
          photoURL: "https://picsum.photos/207",
        },
        {
          slug: "node",
          name: "Node",
          photoURL: "https://picsum.photos/208",
        },
        {
          slug: "express",
          name: "Express",
          photoURL: "https://picsum.photos/209",
        },
        {
          slug: "mongodb",
          name: "MongoDB",
          photoURL: "https://picsum.photos/210",
        },
        {
          slug: "mysql",
          name: "MySQL",
          photoURL: "https://picsum.photos/211",
        },
        {
          slug: "postgresql",
          name: "PostgreSQL",
          photoURL: "https://picsum.photos/212",
        },
      ],
    },
  };
};
