/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HeroSection } from "@components/Sections/Landing/HeroSection";
import { ResourceSection } from "@components/Sections/Landing/ResourceSection";
import { SearchSection } from "@components/Sections/Landing/SearchSection";
import { CookieAlert } from "@components/UI/CookieAlert";
import { Resource } from "@definitions/Resource";
import { AppLayout } from "@components/Layout/AppLayout";
import type { GetServerSideProps, NextPage } from "next";
import { useTranslations } from "next-intl";
import { fetchRSR } from "@utils/fetchRSR";
import { Channel } from "@definitions/Channel";
import { ChannelSection } from "@components/Sections/Landing/ChannelSection";

type Props = {
  resources: Resource[];
  channels: Channel[];
};

const Home: NextPage<Props> = ({ resources, channels }: Props) => {
  const t = useTranslations("Index");
  return (
    <AppLayout title={t("title")}>
      <HeroSection />
      <SearchSection />
      <section className="flex flex-col h-full px-6 pt-6 pb-6 space-y-6 bg-gray-100 dark:bg-gray-900 lg:px-24 2xl:px-32">
        <ResourceSection resources={resources} />
        <ChannelSection channels={channels} />
      </section>
      <CookieAlert />
    </AppLayout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user },
  } = context.req;
  try {
    const uid = JSON.parse(user || "null")?.data.uid || undefined;
    const rBody = await (
      await fetch(
        `http://localhost:3000/api/resource`,
        uid
          ? {
              headers: { uid },
            }
          : undefined
      )
    ).json();
    const resources =
      (rBody.data?.attributes as Resource[])
        .sort(
          (a, b) =>
            new Date(b.createdAt.toString()).getTime() -
            new Date(a.createdAt.toString()).getTime()
        )
        .filter((_, i) => i < 3) || [];

    let channels = [];
    if (user) {
      const parsedUser = JSON.parse(user);
      const cBody = await (
        await fetchRSR(
          "http://localhost:3000/api/channel/",
          parsedUser?.session
        )
      ).json();

      channels = (cBody.data?.attributes as Channel[]).sort((a, b) => {
        const aHistory = [...a.messages, a.activities].sort(
          (a_a, a_b) =>
            // @ts-ignore
            new Date(a_b.createdAt.toString()).getTime() -
            // @ts-ignore
            new Date(a_a.createdAt.toString()).getTime()
        );

        const bHistory = [...b.messages, b.activities].sort(
          (b_a, b_b) =>
            // @ts-ignore
            new Date(b_b.createdAt.toString()).getTime() -
            // @ts-ignore
            new Date(b_a.createdAt.toString()).getTime()
        );

        return (
          // @ts-ignore
          new Date(bHistory.at(0).createdAt.toString()).getTime() -
          // @ts-ignore
          new Date(aHistory.at(0).createdAt.toString()).getTime()
        );
      });
    }

    return {
      props: {
        resources,
        channels,
        i18n: (await import(`../i18n/${context.locale}.json`)).default,
      },
    };
  } catch (e) {
    return {
      props: {
        resources: [],
        channels: [],
        i18n: (await import(`../i18n/${context.locale}.json`)).default,
      },
    };
  }
};
