import { SidebarDropdownAdmin } from "@components/dropdowns/SidebarDropdownAdmin";
import { UserDropdown } from "@components/dropdowns/UserDropdown";
import { Logo } from "@components/ui/Logo";

export const TopNavigationAdmin: React.FC<any> = ({
                                          config = { shadow: true, backgroundColor: "bg-white dark:bg-gray-900" },
                                      }: {
    config: { shadow: boolean; backgroundColor: string };
}) => {
    return (
        <div
            className={
                (config.shadow ? "shadow-md " : " ") +
                config.backgroundColor +
                " inline-flex items-center justify-between w-full z-40 h-16 px-6 m-0 bg-white dark:bg-black"
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
