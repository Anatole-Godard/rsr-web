import { Logo } from "@components/ui/Logo";
import {
  ChatIcon,
  CogIcon,
  CollectionIcon,
  HomeIcon,
  LibraryIcon,
  PlusIcon,
  UserAddIcon,
  UserIcon,
  // ShoppingBagIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { useRouter } from "next/router";
import { SidebarIcon, SidebarIconXL } from "./SidebarIcon";

const className = { className: "shrink-0 w-5 h-5" };

export const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;
  const { user } = useAuth();

  return (
    <div className="h-full z-[41] fixed flex-col hidden px-2 bg-white shadow-lg top-0 md:flex min-w-max dark:bg-black dark:border-r dark:border-gray-900 justify-between pt-5">
      <div>
        <div className="mb-6">
          <Logo />
        </div>
        <SidebarIcon
          icon={<HomeIcon {...className} />}
          active={pathname === "/"}
          href="/"
          text="Accueil"
        />
        <Divider />
        <SidebarTitle text="Profil" />
        {user ? (
          <>
            <SidebarIcon
              icon={<UserIcon {...className} />}
              active={pathname.includes("/user")}
              text="Profil"
              href="/user"
            />
            <SidebarIconXL
              icon={<CollectionIcon {...className} />}
              active={pathname.includes("/user/playlists")}
              text="Playlists"
              href="/user/playlists"
            />
            <SidebarIconXL
              icon={<CogIcon {...className} />}
              active={pathname.includes("/user/settings")}
              text="Paramètres"
              href="/user/settings"
            />
          </>
        ) : (
          <>
            <SidebarIcon
              icon={<UserIcon {...className} />}
              active={false}
              text="Se connecter"
              href="/auth/login"
            />
            <SidebarIcon
              icon={<UserAddIcon {...className} />}
              active={false}
              text="Créer un compte"
              href="/auth/register"
            />
          </>
        )}
        <DividerXL />
        <SidebarTitle text="Ressources" />
        <SidebarIcon
          icon={<LibraryIcon {...className} />}
          active={pathname.includes("/resource")}
          text="Bibliothèque"
          href="/resource"
        />
        <SidebarIconXL
          icon={<PlusIcon {...className} />}
          active={pathname.includes("/resource/create")}
          text="Créer une ressource"
          href="/resource/create"
        />
        <DividerXL />
        <SidebarTitle text="Salons" />
        <SidebarIcon
          icon={<ChatIcon {...className} />}
          active={pathname.includes("/channel")}
          text="Salons"
          href="/channel"
        />
        <SidebarIconXL
          icon={<PlusIcon {...className} />}
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
              icon={<CogIcon {...className} />}
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
