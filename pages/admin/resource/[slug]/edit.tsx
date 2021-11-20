import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import { NextPage } from "next";

const ResourceEditPage: NextPage<any> = ({}) => {
  return (
    <AppLayoutAdmin>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-900 h-full w-full p-3">
        edit
      </div>
    </AppLayoutAdmin>
  );
};

export default ResourceEditPage;
