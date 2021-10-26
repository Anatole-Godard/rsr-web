import { TopNavigation } from "components/navbar/TopNavigation";
import { SideBar } from "components/sidebar/Sidebar";
import React, { ReactNode } from "react";

export const AppLayout: React.FC = ({
  topNavigation = { shadow: true },
  children,
}: {
  topNavigation?: any;
  children?: ReactNode;
}) => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <TopNavigation config={topNavigation} />
      <div className="flex flex-row w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-black">
        <SideBar />
        <div className="flex flex-col w-full min-h-full">{children}</div>
      </div>
    </div>
  );
};
