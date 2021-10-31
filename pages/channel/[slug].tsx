import { ChannelResource } from "@components/channel/Resource";
import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import { fakeResource } from "@utils/faker.dev";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

const ChannelSlug: NextPage<any> = ({
  channels,
}: {
  channels: {
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
  const chat = [
    {
      content: "Hello world",
      createdAt: "2020-01-01T00:00:00.000Z",
      user: {
        fullName: "John Doe",
        avatar: "https://via.placeholder.com/150",
      },
    },
    {
      content: "Hello world",
      createdAt: "2020-01-01T00:00:00.000Z",
      user: {
        fullName: "John Doe",
        avatar: "https://via.placeholder.com/150",
      },
    },
  ];

  return (
    <AppLayout sidebar={{ size: "small" }}>
      <div className="flex flex-col w-full h-full xl:flex-row">
        <Sidebar
          channels={channels}
          canExpand
          isExpanded={false}
          canReturn
          selectedChannelSlug={slug as string}
        />
        <div className="flex justify-center w-full h-full xl:p-6">
          <div className="flex flex-col w-full mx-auto bg-gray-100 xl:shadow xl:mx-12 xl:rounded-xl">
            {/* HEADER */}
            <div className="inline-flex justify-between w-full p-3 px-6">
              <div className="flex flex-col ">
                <div className="inline-flex items-center">
                  <p className="text-xl font-medium text-gray-800 font-marianne">
                    {"#" + slug}
                  </p>
                  {/* <span className=" text-[0.6rem] ml-3 h-3 min-w-max w-full bg-gray-200 text-black font-bold rounded-full">
                    {chat.length}
                  </span> */}
                </div>
                {description && (
                  <p className="text-sm font-light text-gray-500 font-spectral">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col flex-grow p-3 bg-white xl:rounded-xl">
              <ChannelResource {...fakeResource()} />
            </div>

            {/* FOOTER */}
            <div className="inline-flex justify-between w-full p-3 px-6"></div>
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
      channels: [
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
