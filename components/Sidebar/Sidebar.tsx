import { Logo } from "@components/UI/Logo";
import {
  ChatIcon,
  CogIcon,
  CollectionIcon,
  HomeIcon,
  LibraryIcon,
  PlusIcon,
  UserAddIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import {
  Divider,
  DividerXL,
  SidebarIcon,
  SidebarIconXL,
  SidebarTitle,
} from "./SidebarIcon";

const className = { className: "shrink-0 w-5 h-5" };

export const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;
  const { user } = useAuth();

  const t = useTranslations("Sidebar");

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
          text={t("home")}
          id="link-home"
        />
        <Divider />
        <SidebarTitle text={t("profile")} />
        {user ? (
          <>
            <SidebarIcon
              icon={<UserIcon {...className} />}
              active={pathname.includes("/user")}
              text={t("profile")}
              href="/user"
              id="link-user-profile"
            />
            <SidebarIconXL
              icon={<CollectionIcon {...className} />}
              active={pathname.includes("/user/playlists")}
              text={t("playlists")}
              href="/user/playlists"
              id="link-user-playlists"
            />
            <SidebarIconXL
              icon={<CogIcon {...className} />}
              active={pathname.includes("/user/settings")}
              text={t("settings")}
              href="/user/settings"
              id="link-user-settings"
            />
          </>
        ) : (
          <>
            <SidebarIcon
              icon={<UserIcon {...className} />}
              active={false}
              text={t("login")}
              href="/auth/login"
              id="link-login"
            />
            <SidebarIcon
              icon={<UserAddIcon {...className} />}
              active={false}
              text={t("register")}
              href="/auth/register"
              id="link-register"
            />
          </>
        )}
        <DividerXL />
        <SidebarTitle text={t("resources")} />
        <SidebarIcon
          icon={<LibraryIcon {...className} />}
          active={pathname.includes("/resource")}
          text={t("library")}
          href="/resource"
          id="link-resource-library"
        />
        {user && (
          <SidebarIconXL
            icon={<PlusIcon {...className} />}
            active={pathname.includes("/resource/create")}
            text={t("resource-create")}
            href="/resource/create"
            id="link-resource-create"
          />
        )}
        {user && (
          <>
            <DividerXL />
            <SidebarTitle text={t("channels")} />
            <SidebarIcon
              icon={<ChatIcon {...className} />}
              active={pathname.includes("/channel")}
              text={t("channels")}
              href="/channel"
              id="link-channels"
            />
            <SidebarIconXL
              icon={<PlusIcon {...className} />}
              active={pathname.includes("/channel/create")}
              text={t("channel-create")}
              href="/channel/create"
              id="link-channel-create"
            />
          </>
        )}
      </div>
      {user &&
        (user.session.role === "admin" ||
          user.session.role === "superadmin") && (
          <div className="mb-4">
            <SidebarIcon
              icon={<CogIcon {...className} />}
              active={pathname.includes("/admin")}
              text={t("admin")}
              href="/admin"
              id="link-admin"
            />
          </div>
        )}
    </div>
  );
};
