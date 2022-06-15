import { AppLayout } from "@components/Layout/AppLayout";
import { ChangePassword } from "@components/User/ChangePassword";
import { PictureChanger } from "@components/User/PictureChanger";
import { DisableAccount } from "@components/User/DisableAccount";
import { SessionsViewer } from "@components/User/SessionsViewer";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { RetrieveAccount } from "@components/User/RetrieveAccount";
import { GetStartedResetter } from "@components/User/GetStartedResetter";

const UserIndexPage: NextPage<any> = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full bg-white dark:bg-black ">
        <div className="flex flex-col w-full px-6 py-6 space-y-3 bg-white lg:justify-between lg:items-end lg:flex-row shrink-0 lg:px-12 dark:bg-black dark:border-gray-800 lg:space-y-0">
          <div className="inline-flex items-center">
            <Image
              className="rounded-full"
              src={user?.data.photoURL || "/uploads/user/default.png"}
              width={32}
              height={32}
              alt={user?.data.fullName}
            />
            <h3 className="ml-5 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              Paramètres
            </h3>
          </div>

          <Link href="/user">
            <a className="btn-gray h-fit w-fit">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Retour
            </a>
          </Link>
        </div>
        <div className="flex flex-col p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900 grow xl:rounded-tl-xl">
          {user && (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 h-fit">
              <PictureChanger />
              <ChangePassword />
              <SessionsViewer />
              <DisableAccount />
              <RetrieveAccount />
              <GetStartedResetter />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const {
    cookies: { user },
  } = ctx.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };

  return {
    props: {},
  };
};

export default UserIndexPage;
