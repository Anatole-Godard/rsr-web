import {
  HomeIcon,
  UserIcon,
  ExclamationIcon,
  TagIcon,
  LibraryIcon,
  FingerPrintIcon,
} from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import {
  Divider,
  DividerXL,
  SidebarIcon,
  SidebarIconXL,
  SidebarTitle,
} from "./SidebarIcon";
import { useAuth } from "@hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { Logo } from "@components/UI/Logo";

const className = { className: "shrink-0 w-5 h-5" };

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
          icon={<ArrowLeftIcon {...className} />}
          active={false}
          href="/"
          text="Retour à l'accueil"
          id="link-home"
        />
        <SidebarIcon
          key={uuidv4()}
          icon={<HomeIcon {...className} />}
          active={pathname === "/admin"}
          href="/admin"
          text="Tableau de bord"
          id="link-admin-dashboard"
        />
        <Divider />
        <SidebarTitle text="Ressources" />
        <SidebarIcon
          icon={<LibraryIcon {...className} />}
          active={pathname.includes("/admin/resource")}
          text="Ressources"
          href="/admin/resource"
          id="link-admin-resources-library"
        />
        <SidebarIconXL
          icon={<TagIcon {...className} />}
          active={pathname.includes("/admin/tags")}
          text="Étiquettes"
          href="/admin/tags"
          id="link-admin-resources-tags"
        />
        <DividerXL />

        {user &&
          (user.session.role === "admin" ||
            user.session.role === "superadmin") && (
            <>
              <SidebarTitle text="Utilisateurs" />
              <SidebarIcon
                key={uuidv4()}
                active={pathname === "/admin/user"}
                icon={<UserIcon {...className} />}
                text="Utilisateurs"
                href="/admin/user"
                id="link-admin-users"
              />
              <DividerXL />
            </>
          )}
        <SidebarTitle text="Signalements" />

        <SidebarIcon
          key={uuidv4()}
          active={pathname === "/admin/report"}
          icon={<ExclamationIcon {...className} />}
          text="Signalements"
          href="/admin/report"
          id="link-admin-report"
        />
        <DividerXL />

        {user &&
          (user.session.role === "admin" ||
            user.session.role === "superadmin") && (
            <>
              <SidebarTitle text="Logs" />
              <SidebarIcon
                key={uuidv4()}
                active={pathname === "/admin/logs"}
                icon={<FingerPrintIcon {...className} />}
                text="Routes"
                href="/admin/logs"
                id="link-admin-logs"
              />
              
            </>
          )}
      </div>
    </div>
  );
};
