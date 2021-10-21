import { AppLayout } from "components/layouts/AppLayout";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <AppLayout>
      <div className="p-6 text-4xl font-extrabold uppercase font-marianne text-bleuFrance-500">
        hello <span className="text-rougeMarianne-500">rsr</span>
      </div>
    </AppLayout>
  );
};

export default Home;
