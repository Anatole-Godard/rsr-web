import { Sidebar } from "@components/Channel/Sidebar";
import { AppLayout } from "@components/Layout/AppLayout";
import { Channel } from "@definitions/Channel";
import { fetchRSR } from "libs/fetchRSR";
import { GetServerSideProps, NextPage } from "next";
import { useTranslations } from "next-intl";

const Channel: NextPage<any> = ({
                                  sideBarChannels
                                }: {
  sideBarChannels: Channel[];
}) => {
  const t = useTranslations("ChannelIndex");
  return (
    <AppLayout title={t("title")}>
      <div className='flex flex-col w-full h-full max-h-[calc(100vh-4rem)] xl:flex-row'>
        <Sidebar channels={sideBarChannels} />
      </div>
    </AppLayout>
  );
};

export default Channel;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user }
  } = context.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login"
      }
    };

  const parsedUser = JSON.parse(user);
  const channels = await (
    await fetchRSR("http://localhost:3000/api/channel/", parsedUser?.session)
  ).json();

  return {
    props: {
      sideBarChannels: channels?.data?.attributes,
      i18n: (await import(`../../i18n/${context.locale}.json`)).default
    }
  };
};
