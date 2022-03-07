import {
  ChatIcon,
  CogIcon,
  HomeIcon,
  LibraryIcon,
  PlusIcon,
  UserIcon,
  // ShoppingBagIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { useRouter } from "next/router";
import { SidebarIcon, SidebarIconXL } from "./SidebarIcon";

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
        <SidebarTitle text="Profil" />
        <SidebarIcon
          icon={UserIcon}
          active={pathname === "/user"}
          text="Profil"
          href="/user"
        />
        <SidebarIconXL
          icon={CogIcon}
          active={pathname.includes("/user/settings")}
          text="Paramètres"
          href="/user/settings"
        />
        <DividerXL />
        <SidebarTitle text="Ressources" />
        <SidebarIcon
          icon={LibraryIcon}
          active={pathname.includes("/resource")}
          text="Bibliothèque"
          href="/resource"
        />
        <SidebarIconXL
          icon={PlusIcon}
          active={pathname.includes("/resource/create")}
          text="Créer une ressource"
          href="/resource/create"
        />
        <DividerXL />
        <SidebarTitle text="Salons" />
        <SidebarIcon
          icon={ChatIcon}
          active={pathname.includes("/channel")}
          text="Salons"
          href="/channel"
        />
        <SidebarIconXL
          icon={PlusIcon}
          active={pathname.includes("/channel/create")}
          text="Créer un salon"
          href="/channel/create"
        />
      </div>
      {user &&
        (user.session.role === "admin" ||
          user.session.role === "superadmin") && (
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
const DividerXL = () => <hr className="hidden sidebar-hr xl:flex" />;

const SidebarTitle = ({ text }) => (
  <h4 className="pl-2.5 my-2 text-xs hidden xl:flex text-gray-400 dark:text-gray-600 font-marianne">
    {text}
  </h4>
);
