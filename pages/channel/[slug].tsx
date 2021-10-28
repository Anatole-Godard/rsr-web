import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
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
        <div className="flex flex-col w-full h-full bg-gray-50"></div>
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
