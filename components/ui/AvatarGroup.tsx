/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import { UserMinimum } from "@definitions/User";
import Link from "next/link";

export const AvatarGroup = ({
  users,
  limit = 5,
  xl = false,
}: {
  users: UserMinimum[];
  limit?: number;
  xl?: boolean;
}) => {
  return (
    <div className={"flex " + (xl ? "-space-x-1 md:-space-x-5" : "-space-x-1")}>
      {users?.map(
        (user, index) =>
          index < limit && (
            <Link key={index} href={"/user/" + user.uid}>
              <img
                className={
                  "inline-block select-none rounded-full cursor-pointer ring-2 ring-white dark:ring-gray-800 " +
                  (xl ? "md:w-12 md:h-12 w-6 h-6" : "w-6 h-6")
                }
                src={
                  user.photoURL
                    ? user.photoURL
                    : "https://ui-avatars.com/api/?name=" +
                      user.fullName +
                      "&color=007bff&background=054880"
                }
                alt={user.fullName}
              />
            </Link>
          )
      )}
      {users.length > limit && (
        <span
          className={
            "flex items-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 justify-center ring-2 ring-white dark:ring-gray-800 font-bold select-none" +
            (xl ? " md:w-12 md:h-12 w-6 h-6" : " w-6 h-6")
          }
        >
          +{users.length - limit}
        </span>
      )}
    </div>
  );
};
