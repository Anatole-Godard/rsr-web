import {
  ChatIcon,
  CogIcon,
  HomeIcon,
  LibraryIcon,
  // ShoppingBagIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { useRouter } from "next/router";
import { SidebarIcon } from "./SidebarIcon";

export const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;
  const { user } = useAuth();

  return (
    <div className="h-full z-[41] fixed flex-col hidden px-2 bg-white shadow-lg top-0 md:flex min-w-max dark:bg-black dark:border-r dark:border-gray-900 justify-between pt-12">
      <div>
        <SidebarIcon
          icon={HomeIcon}
          active={pathname === "/"}
          href="/"
          text="Accueil"
        />
        <Divider />
        <SidebarIcon
          icon={LibraryIcon}
          active={pathname.includes("/resource")}
          text="Bibliothèque"
          href="/resource"
        />
        <SidebarIcon
          icon={ChatIcon}
          active={pathname.includes("/channel")}
          text="Salons"
          href="/channel"
        />
      </div>
      {user &&
        (user.session.role === "admin" || user.session.role === "superadmin") && (
          <div className="mb-4">
            <SidebarIcon
              icon={CogIcon}
              active={pathname.includes("/admin")}
              text="Administration"
              href="/admin"
            />
          </div>
        )}
    </div>
  );
};

const Divider = () => <hr className="sidebar-hr" />;
