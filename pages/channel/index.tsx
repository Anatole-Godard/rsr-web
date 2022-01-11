import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import { GetServerSideProps, NextPage } from "next";

const Channel: NextPage<any> = ({
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
  return (
    <AppLayout sidebar={{ size: "small" }}>
      <div className="flex flex-col w-full h-full max-h-[calc(100vh-4rem)] xl:flex-row">
        <Sidebar channels={channels} canExpand isExpanded canReturn={false} />
      </div>
    </AppLayout>
  );
};

export default Channel;

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
        
      ],
    },
  };
};
