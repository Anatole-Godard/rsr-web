import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import { NextPage } from "next";

const ResourceCreatePage: NextPage<any> = ({}) => {
  return (
    <AppLayoutAdmin>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-900 h-full w-full p-3">
        Create
      </div>
    </AppLayoutAdmin>
  );
};

export default ResourceCreatePage;
