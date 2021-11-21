import { useAuth } from "@hooks/useAuth";
import { AppLayout } from "components/layouts/AppLayout";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { user } = useAuth();
  return (
    <AppLayout>
      <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
    </AppLayout>
  );
};

export default Home;
