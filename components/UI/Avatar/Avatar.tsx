import { UserMinimum } from "@definitions/User";
import Link from "next/link";

type AvatarProps = {
  user: UserMinimum;
  xl?: boolean;
};

export const Avatar = ({ user, xl = false }: AvatarProps) => {
  return (
    <Link href={"/user/" + user.uid}>
      <img
        className={
          "inline-block select-none rounded-full cursor-pointer ring-2 ring-white dark:ring-gray-800 bg-white dark:bg-black " +
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
  );
};
