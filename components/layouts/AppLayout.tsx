import { TopNavigation } from "components/navbar/TopNavigation";
import { SideBar } from "components/sidebar/Sidebar";
import React from "react";

export const AppLayout: React.FC = ({ children }) => {
  return (
    <div className="flex w-screen min-h-screen">
      <SideBar />
      <div className="w-full h-full">
        <TopNavigation />
        <div className="container-content">{children}</div>
      </div>
    </div>
  );
};
