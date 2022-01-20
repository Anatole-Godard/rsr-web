import { AppLayout } from "@components/layouts/AppLayout";
import { ChangePassword } from "@components/user/ChangePassword";
import { ChangeProfilePicture } from "@components/user/ChangeProfilePicture";
import { SessionsViewer } from "@components/user/SessionsViewer";
import { UserResources } from "@components/user/UserResources";
import { useAuth } from "@hooks/useAuth";
import { NextPage } from "next";
import Image from "next/image";

const UserUIDPage: NextPage<any> = ({ uid, photoURL, fullName, resources }) => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900 ">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end w-full">
            <div className="w-auto h-auto">
              <Image
                src={photoURL || "/uploads/user/default.png"}
                width={64}
                height={64}
                alt={fullName}
              />
            </div>
            <h3 className="mb-3 ml-5 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              {fullName}
            </h3>
          </div>
        </div>
        <div className="flex flex-col p-6 overflow-y-auto bg-gray-100 grow xl:rounded-tl-xl">
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3 h-fit">
            <UserResources resources={resources} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserUIDPage;

export async function getServerSideProps(context) {
  const { uid } = context.query;
  const body = await (
    await fetch(
      `${process.env.API_URL || "http://localhost:3000/api"}/user/${uid}`
    )
  ).json();

  const user = body?.data?.attributes;

  return {
    props: {
      ...user,
    },
  };
}
