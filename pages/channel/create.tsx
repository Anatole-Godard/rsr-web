import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import { GetServerSideProps, NextPage } from "next";

const ChannelCreate: NextPage<any> = ({
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
      <div className="flex flex-col w-full h-full xl:flex-row">
        <Sidebar
          channels={channels}
          canExpand={false}
          isExpanded={false}
          canReturn
          isCreatingChannel
        />
        <div className="w-full h-full xl:p-6">
          <div className="w-full p-6 mx-auto bg-gray-100 xl:max-w-3xl xl:rounded-xl"></div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChannelCreate;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      channels: [],
    },
  };
};
