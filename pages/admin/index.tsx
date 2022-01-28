import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <AppLayoutAdmin>
      <div className="flex flex-col w-full h-full bg-white dark:bg-black grow">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end justify-between w-full mb-2">
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                Tableau de bord
              </h3>
            </div>
          </div>
        </div>
        <div className="h-full p-6 bg-gray-100 min-h-max max-h-max dark:bg-gray-900 lg:p-12"></div>
      </div>
    </AppLayoutAdmin>
  );
};

export default Home;
