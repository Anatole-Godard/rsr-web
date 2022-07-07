/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import { UserMinimum } from "@definitions/User";
import Link from "next/link";
import { Avatar } from "./Avatar";

const DEFAULT_LIMIT = 5;
const DEFAULT_LARGE = false;

export const AvatarGroup = ({
  users,
  limit = DEFAULT_LIMIT,
  xl = DEFAULT_LARGE,
}: {
  users: UserMinimum[];
  limit?: number;
  xl?: boolean;
}) => {
  return (
    <div className={"flex " + (xl ? "-space-x-1 md:-space-x-5" : "-space-x-1")}>
      {users?.map(
        (user, index) =>
          index < limit && <Avatar key={index} user={user} xl={xl} />
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
