import { ChatIcon, HomeIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Link from "next/link";

export const SideBar = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="sidebar">
      <SideBarIcon
        icon={HomeIcon}
        active={pathname === "/"}
        href="/"
        text="Accueil"
      />
      <Divider />
      <SideBarIcon
        active={pathname === "/store"}
        icon={ShoppingCartIcon}
        text="Catalogue"
        href="/store"
      />
      <SideBarIcon
        icon={ChatIcon}
        active={pathname === "/channel"}
        text="Canaux"
        href="/channel"
      />
    </div>
  );
};

const SideBarIcon = ({
  icon,
  text = "tooltip 💡",
  active = false,
  href,
}: {
  icon: JSX.Element | any;
  text?: string;
  active?: boolean;
  href: string;
}) => (
  <Link href={href}>
    <div className="flex w-full cursor-pointer xl:items-center xl:px-4 group">
      <div
        className={
          (active
            ? " dark:bg-gray-100 text-blue-500 group-hover:bg-blue-600"
            : "dark:text-gray-100 text-gray-500 group-hover:bg-gray-600 ") +
          " sidebar-icon"
        }
      >
        {icon({ className: "flex-shrink-0 w-5 h-5" })}
        <span
          className={
            (active ? "hidden" : "") +
            " ml-6 xl:hidden sidebar-tooltip group-hover:scale-100"
          }
        >
          {text}
        </span>
        <span
          className={
            (active ? "flex" : "hidden xl:flex") +
            " text-[0.65rem] font-bold flex-col xl:flex-row xl:items-center"
          }
        >
          <hr
            className={
              (active
                ? "border-blue-500 dark:border-blue-100  "
                : "border-gray-500 dark:border-gray-100 ") +
              " hidden xl:flex pt-1 mx-2 mt-1 duration-300 ease-linear border-t-2  xl:pt-0 xl:mt-0 xl:h-4 group-hover:border-white xl:border-t-0 xl:border-l-2 "
            }
          />
          {text}
        </span>
      </div>
    </div>
  </Link>
);

const Divider = () => <hr className="sidebar-hr" />;
