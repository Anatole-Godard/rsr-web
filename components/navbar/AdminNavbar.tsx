import { SidebarDropdownAdmin } from "@components/dropdowns/SidebarDropdownAdmin";
import { UserDropdown } from "@components/dropdowns/UserDropdown";
import { Logo } from "@components/ui/Logo";

export const NavbarAdmin: React.FC<any> = ({
  config = { shadow: false, backgroundColor: "bg-white" },
}: {
  config: { shadow: boolean; backgroundColor: string };
}) => {
  return (
    <div
      className={
        (config.shadow ? "shadow-md " : " ") +
        config.backgroundColor +
        " inline-flex items-center fixed top-0 justify-between w-full md:w-[calc(100vw-4rem)] z-40 h-16 px-12 m-0 bg-white dark:bg-black"
      }
    >
      <Logo />
      <div className="inline-flex items-center justify-end pl-6 space-x-4 lg:w-72 shrink-0 lg:pl-0 ">
        {/* <ThemeIcon /> */}
        <SidebarDropdownAdmin />
        <UserDropdown />
      </div>
    </div>
  );
};
