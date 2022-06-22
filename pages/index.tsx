import { HeroSection } from "@components/Sections/Landing/HeroSection";
import { ResourceSection } from "@components/Sections/Landing/ResourceSection";
import { SearchSection } from "@components/Sections/Landing/SearchSection";
import { CookieAlert } from "@components/UI/CookieAlert";
import { Resource } from "@definitions/Resource";
import { AppLayout } from "@components/Layout/AppLayout";
import type { GetServerSideProps, NextPage } from "next";

const Home: NextPage<any> = ({ resources }: { resources: Resource[] }) => {
  return (
    <AppLayout title="Accueil">
      <HeroSection />
      <SearchSection />
      <section className="flex flex-col h-full px-6 pt-6 pb-6 space-y-6 bg-gray-100 dark:bg-gray-900 lg:px-24 2xl:px-32">
        <ResourceSection resources={resources} />
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
  const uid = JSON.parse(user || "null")?.data.uid || undefined;
  const body = await (
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
    (body.data?.attributes as Resource[])
      .sort(
        (a, b) =>
          new Date(b.createdAt.toString()).getTime() -
          new Date(a.createdAt.toString()).getTime()
      )
      .filter((_, i) => i < 3) || [];

  return {
    props: {
      resources,
      i18n: (await import(`../i18n/${context.locale}.json`)).default
    },
  };
};
