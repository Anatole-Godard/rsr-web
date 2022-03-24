import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import { Channel } from "@definitions/Channel";
import { fetchRSR } from "@utils/fetchRSR";
import { GetServerSideProps, NextPage } from "next";

const Channel: NextPage<any> = ({
  sideBarChannels,
}: {
  sideBarChannels: Channel[];
}) => {
  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full max-h-[calc(100vh-4rem)] xl:flex-row">
        <Sidebar channels={sideBarChannels} />
      </div>
    </AppLayout>
  );
};

export default Channel;

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

  return {
    props: {
      sideBarChannels: channels?.data?.attributes,
    },
  };
};
