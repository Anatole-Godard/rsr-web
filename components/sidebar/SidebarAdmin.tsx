import {
  DocumentTextIcon,
  HomeIcon,
  UserIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { SidebarIcon } from "./SidebarIcon";
import { useAuth } from "@hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { Logo } from "@components/ui/Logo";

export const SidebarAdmin = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="h-full z-[41] fixed flex-col hidden px-2 bg-white shadow-lg top-0 md:flex min-w-max dark:bg-black dark:border-r dark:border-gray-900 justify-between pt-5">
      <div>
        <div className="mb-6">
          <Logo />
        </div>
        <SidebarIcon
          key={uuidv4()}
          icon={ArrowLeftIcon}
          active={false}
          href="/"
          text="Retour à l'accueil"
        />
        <SidebarIcon
          key={uuidv4()}
          icon={HomeIcon}
          active={pathname === "/admin"}
          href="/admin"
          text="Tableau de bord"
        />
        <Divider />
        <SidebarIcon
          key={uuidv4()}
          active={pathname === "/admin/resource"}
          icon={DocumentTextIcon}
          text="Ressources"
          href="/admin/resource"
        />
        {user &&
          (user.session.role === "admin" ||
            user.session.role === "superadmin") && (
            <SidebarIcon
              key={uuidv4()}
              active={pathname === "/admin/user"}
              icon={UserIcon}
              text="Utilisateurs"
              href="/admin/user"
            />
          )}
        <SidebarIcon
          key={uuidv4()}
          active={pathname === "/admin/report"}
          icon={ExclamationIcon}
          text="Signalements"
          href="/admin/report"
        />
      </div>
    </div>
  );
};

const Divider = () => <hr className="sidebar-hr" />;
