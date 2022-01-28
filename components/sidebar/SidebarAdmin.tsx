import { DocumentTextIcon, HomeIcon, UserIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

import { SidebarIcon } from "./SidebarIcon";

export const SidebarAdmin = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="h-full z-[41] fixed flex-col hidden px-2 bg-white shadow-lg top-0 md:flex min-w-max dark:bg-black dark:border-r dark:border-gray-900 justify-between pt-12">
      <div>
        <SidebarIcon
          icon={ArrowLeftIcon}
          active={false}
          href="/"
          text="Retour à l'accueil"
        /><SidebarIcon
          icon={HomeIcon}
          active={pathname === "/admin"}
          href="/admin"
          text="Tableau de bord"
        />
        <Divider />
        <SidebarIcon
          active={pathname === "/admin/resource"}
          icon={DocumentTextIcon}
          text="Ressources"
          href="/admin/resource"
        />
        <SidebarIcon
          active={pathname === "/admin/user"}
          icon={UserIcon}
          text="Utilisateurs"
          href="/admin/user"
        />
      </div>
    </div>
  );
};



const Divider = () => <hr className="sidebar-hr" />;
