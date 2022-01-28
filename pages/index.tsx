import { HeroSection } from "@components/landing/HeroSection";
import { ResourceSection } from "@components/landing/ResourceSection";
import { SearchSection } from "@components/landing/SearchSection";
import { AppLayout } from "components/layouts/AppLayout";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <AppLayout>
      <HeroSection />
      <SearchSection />
      <section className="flex flex-col h-full px-6 pt-6 pb-6 space-y-6 bg-gray-100 dark:bg-black lg:px-24 2xl:px-32">
        <ResourceSection resources={[]} />
      </section>
    </AppLayout>
  );
};

export default Home;
