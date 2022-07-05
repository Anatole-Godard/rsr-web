import { MediaUploader } from "@components/Channel/Helper/Media/Uploader";
import { AppLayout } from "@components/Layout/AppLayout";
import { Media } from "@definitions/Resource/Media";
import {
  CheckIcon,
  CloudUploadIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { classes } from "libs/classes";
import { fetchRSR } from "libs/fetchRSR";
import type { GetServerSideProps, NextPage } from "next";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import slug from "slug";

const Select: any = dynamic(() => import("react-select") as any, {
  ssr: false,
});

type MemberValue = { label: string; value: string; photoURL: string };

const ChannelCreate: NextPage<any> = ({
  membersOptions,
}: {
  membersOptions: MemberValue[];
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations("ChannelCreate");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [privateGroup, setPrivateGroup] = useState<boolean>(false);

  const [members, setMembers] = useState<MemberValue[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);

  const [validForm, setValidForm] = useState<boolean>(false);
  const [requestOk, setRequestOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validForm) {
      setLoading(true);
      try {
        const toastID = toast.loading(t("toast-create-loading"));
        const response = await fetchRSR("/api/channel/create", user?.session, {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            visibility: privateGroup ? "private" : "public",
            members: members.map((member) => ({
              uid: member.value,
              photoURL: member.photoURL,
              fullName: member.label,
            })),
          }),
        });
        toast.dismiss(toastID);

        const body = await response.json();
        if (response.ok && medias.length > 0) {
          const responses = [];
          for (const media of medias) {
            const formData = new FormData();
            formData.append("file", media as any);
            formData.append("name", media.name);
            formData.append("type", media.type);
            formData.append("size", media.size.toString());
            responses.push(
              await fetch(`/api/channel/${body.data.attributes.slug}/upload`, {
                method: "POST",
                body: formData,
              })
            );
          }
          if (responses.every((r) => r.ok)) {
            setRequestOk(true);
            toast.success(t("toast-create-success"));
            router.push(`/channel/${body.data.attributes.slug}`);
          } else setRequestOk(false);
        } else if (response.ok && medias.length === 0) {
          toast.success(t("toast-create-success"));
          router.push(`/channel/${body.data.attributes.slug}`);
          setRequestOk(true);
        }
      } catch (err) {
        toast.error(t("toast-create-error"));
        // console.log(err);
      }
      setLoading(false);
    }
  };

  // Form validations
  useEffect(() => {
    if (name && description && (members.length > 0 || !privateGroup)) {
      setValidForm(true);
    } else setValidForm(false);
  }, [name, description, members, privateGroup]);

  return (
    <AppLayout title={t("head-title")}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900 grow"
      >
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end justify-between w-full">
            <div className="flex flex-col space-y-2">
              <div className="w-auto h-auto">
                <Image
                  src="/img/partypopper.png"
                  width={64}
                  height={64}
                  alt="Partypopper"
                />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                {t("create-title")}
                {name ? (
                  <span className="ml-1 text-green-600 dark:text-green-400">
                    {slug(name)}
                  </span>
                ) : (
                  <span className="inline-flex items-center ml-1">
                    {t("create-title1")}
                    <span className="ml-1 text-green-600 dark:text-green-400">
                      {t("create-title2")}
                    </span>
                  </span>
                )}
              </h3>
            </div>
            <button
              type="submit"
              disabled={!validForm && loading}
              className={classes(
                requestOk ? "btn-green" : validForm ? "btn-green" : "btn-red",
                "group h-fit"
              )}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx={12}
                    cy={12}
                    r={10}
                    stroke="currentColor"
                    strokeWidth={4}
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : requestOk ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-1 text-green-700 duration-300 group-active:text-white" />
                  {t("sent")}
                </>
              ) : validForm ? (
                <>
                  <CloudUploadIcon className="w-4 h-4 mr-1 text-green-700 duration-300 group-active:text-white" />
                  {t("send")}
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4 mr-1 text-red-700 duration-300 group-active:text-white" />
                  {t("invalid")}
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-grow px-4 py-3 pb-6 bg-gray-100 dark:bg-gray-900 rounded-tl-xl md:flex-row">
          <div className="flex flex-col w-full px-2 space-y-3 md:w-1/2">
            <label>
              <h4 className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300">
                {t("title")}
              </h4>
              <input
                type="text"
                className="bg-gray-200 input"
                placeholder={t("title")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </label>
            <label className="flex flex-col grow">
              <h4 className="mb-1 text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-red-500 text-gray-700 font-marianne dark:text-gray-300">
                {t("description")}
              </h4>
              <textarea
                className="bg-gray-200 input grow"
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                value={description}
                placeholder={t("description")}
              ></textarea>
            </label>
          </div>
          <div className="flex flex-col w-full px-2 space-y-3 md:w-1/2">
            <label className="flex flex-col">
              <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 font-marianne">
                {t("visibility")}
              </h4>
              <div className="inline-flex items-center my-2 space-x-3">
                <input
                  type="checkbox"
                  value={privateGroup as unknown as string}
                  onChange={(e) => {
                    setPrivateGroup(e.target.checked);
                    setMembers([]);
                  }}
                  className="w-4 h-4 duration-200 bg-green-200 border-0 rounded-md appearance-none form-checkbox hover:bg-green-400 dark:bg-green-800 dark:hover:bg-green-700 checked:bg-green-600 checked:border-transparent focus:outline-none focus:bg-green-400 dark:focus:bg-green-900 dark:focus:checked:bg-green-300 ring-green-500 dark:checked:bg-green-300"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-spectral">
                  {t("private")}
                </span>
              </div>
            </label>
            {privateGroup && (
              <label>
                <h4 className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300">
                  {t("members")}
                </h4>
                <Select
                  name="members"
                  className="w-full"
                  isMulti
                  value={members}
                  placeholder={
                    <div className="text-sm font-semibold font-spectral">
                      {t("members-placeholder")}
                    </div>
                  }
                  options={membersOptions
                    .filter((member) => member.uid !== user?.data.uid)
                    .map((member) => ({
                      value: member.uid,
                      label: member.fullName,
                      photoURL: member.photoURL,
                    }))}
                  formatOptionLabel={(member: {
                    value: string;
                    label: string;
                    photoURL: string;
                  }) => (
                    <div className="inline-flex items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.photoURL}
                        alt={member.label}
                        className="w-5 h-5 mr-2 rounded-full"
                      />
                      <span className="text-xs text-gray-700 font-marianne">
                        {member.label}
                      </span>
                    </div>
                  )}
                  onChange={(value) => setMembers(value)}
                />
              </label>
            )}

            <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 font-marianne">
              {t("picture")}
            </h4>
            <MediaUploader
              limit={1}
              accepted={["image/*"]}
              files={medias}
              setFiles={setMedias}
            />
          </div>
        </div>
      </form>
    </AppLayout>
  );
};

export default ChannelCreate;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
  const body = await (await fetch("http://localhost:3000/api/user")).json();
  return {
    props: {
      membersOptions: body?.data?.attributes,
      i18n: (await import(`../../i18n/${ctx.locale}.json`)).default,
    },
  };
};
