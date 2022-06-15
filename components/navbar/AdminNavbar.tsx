import { SidebarDropdownAdmin } from "@components/Dropdown/SidebarDropdownAdmin";
import { UserDropdown } from "@components/Dropdown/UserDropdown";

export const NavbarAdmin: React.FC<any> = () => {
  return (
    <div
      className={
        "inline-flex items-center fixed top-0 justify-between w-full md:w-[calc(100vw-4rem)] z-40 h-16 px-12 m-0  xl:w-[calc(100vw-12rem)]"
      }
    >
      <div className=""></div>
      <div className="inline-flex items-center justify-end pl-6 space-x-4 lg:w-72 shrink-0 lg:pl-0 ">
        <SidebarDropdownAdmin />
        <UserDropdown />
      </div>
    </div>
  );
};
