import {
  ChatIcon,
  HomeIcon,
  LibraryIcon,
  ShoppingBagIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Link from "next/link";

import { motion } from "framer-motion";
import { SidebarIcon } from "./SidebarIcon";

export const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;

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
          active={pathname === "/store"}
          icon={ShoppingBagIcon}
          text="Catalogue"
          href="/store"
        />
        <SidebarIcon
          icon={ChatIcon}
          active={pathname.includes("/channel")}
          text="Salons"
          href="/channel"
        />
      </div>
      <div className="mb-4">
        <SidebarIcon
          icon={LibraryIcon}
          active={pathname.includes("/resource")}
          text="Bibliothèque"
          href="/resource"
        />
      </div>
    </div>
  );
};

const Divider = () => <hr className="sidebar-hr" />;
