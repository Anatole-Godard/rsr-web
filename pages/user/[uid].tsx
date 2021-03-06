import { AppLayout } from "@components/Layout/AppLayout";
import { UserResources } from "@components/User/UserResources";
import { Resource } from "@definitions/Resource";
import { UserMinimum } from "@definitions/User";
import { NextPage, GetServerSideProps } from "next";
import { useTranslations } from "next-intl";

type Props = UserMinimum & {
  resources: Resource[];
};

const UserUIDPage: NextPage<Props> = ({
  photoURL,
  fullName,
  resources,
}: Props) => {
  const t = useTranslations("UserUID");
  return (
    <AppLayout title={t("title", { name: fullName })}>
      <div className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900 ">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end w-full">
            <div className="w-auto h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="object-cover w-16 h-16 rounded-full"
                src={photoURL || "/uploads/user/default.png"}
                alt={fullName}
              />
            </div>
            <h3 className="mb-3 ml-5 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              {fullName}
            </h3>
          </div>
        </div>
        <div className="flex flex-col p-6 overflow-y-auto bg-gray-100 grow xl:rounded-tl-xl">
          <UserResources resources={resources} />
        </div>
      </div>
    </AppLayout>
  );
};

export default UserUIDPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { uid } = context.query;

  const {
    cookies: { user },
  } = context.req;
  const headersUid = JSON.parse(user || "null")?.data.uid || undefined;

  const body = await (
    await fetch(
      `${process.env.API_URL || "http://localhost:3000/api"}/user/${uid}`,
      {
        headers: {
          uid: headersUid === uid ? headersUid || undefined : undefined,
        },
      }
    )
  ).json();

  const u = body?.data?.attributes;

  return {
    props: {
      ...u,
      i18n: (await import(`../../i18n/${context.locale}.json`)).default,
    },
  };
};
