import { Sidebar } from "@components/Channel/Sidebar";
import { AppLayout } from "@components/Layout/AppLayout";
import { Channel } from "@definitions/Channel";
import { fetchRSR } from "libs/fetchRSR";
import { GetServerSideProps, NextPage } from "next";
import { useTranslations } from "next-intl";

const Channel: NextPage<any> = ({
  sideBarChannels,
}: {
  sideBarChannels: Channel[];
}) => {
  const t = useTranslations("ChannelIndex");
  return (
    <AppLayout title={t("title")}>
      <div className="flex flex-col w-full  max-h-[calc(100vh-4rem)] min-h-[24rem] h-fit xl:flex-row">
        <Sidebar channels={sideBarChannels} />

        <div className="flex items-center justify-center w-full h-96">
          <div className="text-center  sm:border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 font-marianne sm:text-5xl">
              {t("no-channel-selected")}
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 font-spectral">
              {t("no-channel-selected-text")}
            </p>
          </div>
        </div>
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

  const parsedUser = JSON.parse(user);
  const channels = await (
    await fetchRSR("http://localhost:3000/api/channel/", parsedUser?.session)
  ).json();

  return {
    props: {
      sideBarChannels: channels?.data?.attributes,
      i18n: (await import(`../../i18n/${context.locale}.json`)).default,
    },
  };
};
