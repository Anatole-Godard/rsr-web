import { MediaUploader } from "@components/Channel/Helper/Media/Uploader";
import { AppLayout } from "@components/Layout/AppLayout";
import { Channel } from "@definitions/Channel";
import { Media } from "@definitions/Resource/Media";
import { UserMinimum } from "@definitions/User";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import {
  CheckIcon,
  CloudUploadIcon,
  XCircleIcon,
  XIcon
} from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { classes } from "libs/classes";
import { fetchRSR } from "libs/fetchRSR";
import type { GetServerSideProps, NextPage } from "next";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import slug from "slug";

const Select: any = dynamic(() => import("react-select") as any, {
  ssr: false
});

type MemberValue = {
  label: string;
  value: string;
  photoURL: string;
};

const ChannelEdit: NextPage<any> = ({
  membersOptions,
  ...props
}: Channel & { membersOptions: UserMinimum[] }) => {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations("ChannelCreate");

  const [name, setName] = useState<string>(props.name || "");
  const [description, setDescription] = useState<string | null>(
    props.description
  );
  const [privateGroup, setPrivateGroup] = useState<boolean>(
    props.visibility === "private"
  );

  const [members, setMembers] = useState<MemberValue[]>(
    (props.members as unknown as MemberValue[]) || []
  );
  const [medias, setMedias] = useState<Media[]>(
    props.image ? [props.image] : []
  );

  const [validForm, setValidForm] = useState<boolean>(false);
  const [requestOk, setRequestOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const deleteChannel = async () => {
    const toastID = toast.loading(t("toast-delete-loading"));
    const res = await fetchRSR(
      `/api/channel/${props.slug}/delete`,
      user?.session,
      {
        method: "DELETE"
      }
    );
    toast.dismiss(toastID);
    if (res.ok) {
      router.push("/channel");
      toast.success(t("toast-delete-success"));
    } else toast.error(t("toast-delete-error"));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validForm) {
      setLoading(true);
      try {
        const toastID = toast.loading(t("toast-edit-loading"));
        const response = await fetchRSR(
          "/api/channel/" + props.slug + "/edit",
          user?.session,
          {
            method: "PUT",
            body: JSON.stringify({
              name,
              description,
              visibility: privateGroup ? "private" : "public",
              members: [
                {
                  uid: user?.data.uid,
                  fullName: user?.data.fullName,
                  photoURL: user?.data.photoURL
                },
                ...members.map((member) => ({
                  uid: member.value,
                  photoURL: member.photoURL,
                  fullName: member.label
                }))
              ]
            })
          }
        );

        const body = await response.json();
        toast.dismiss(toastID);
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
                body: formData
              })
            );
          }
          if (responses.every((r) => r.ok)) {
            setRequestOk(true);
            toast.success(t("toast-edit-success"));
            router.push(`/channel/${body.data.attributes.slug}`);
          } else setRequestOk(false);
        } else if (response.ok && medias.length === 0) {
          const response = await fetchRSR(
            `/api/channel/${body.data.attributes.slug}/upload`,
            user?.session,
            {
              method: "DELETE"
            }
          );
          if (response.ok) {
            setRequestOk(true);
            toast.success(t("toast-edit-success"));
            router.push(`/channel/${body.data.attributes.slug}`);
          } else {
            setRequestOk(false);
            toast.error(t("toast-edit-error"));
          }
        }
      } catch (err) {
        // console.log(err);
      }
      setLoading(false);
      router.push(`/channel/${router.query.slug as string}`);
    }
  };

  // Form validations
  useEffect(() => {
    if (name && description && (members.length > 0 || !privateGroup)) {
      setValidForm(true);
    } else setValidForm(false);
  }, [name, description, members, privateGroup]);

  return (
    <AppLayout title={t("head-edit-title", { name })}>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col w-full max-h-full bg-white dark:bg-gray-900 grow'
      >
        <div className='flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800'>
          <div className='inline-flex items-end justify-between w-full'>
            <div className='flex flex-col space-y-2'>
              <div className='w-auto h-auto'>
                <Image
                  src='/img/partypopper.png'
                  width={64}
                  height={64}
                  alt='Partypopper'
                />
              </div>
              <h3 className='mb-2 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200'>
                {t("edit-title")}
                {name ? (
                  <span className='ml-1 text-amber-600 dark:text-amber-400'>
                    {slug(name)}
                  </span>
                ) : (
                  <span className='inline-flex items-center ml-1'>
                    {t("create-title1")}
                    <span className='ml-1 text-amber-600 dark:text-amber-400'>
                      {t("create-title2")}
                    </span>
                  </span>
                )}
              </h3>
            </div>
            <div className='inline-flex items-center space-x-2'>
              <button
                type='button'
                onClick={() => setDeleteModalOpen(true)}
                className='btn-red'
              >
                <TrashIcon className='w-4 h-4 mr-1' />
                {t("delete")}
              </button>
              <button
                type='submit'
                className={classes(
                  requestOk ? "btn-amber" : validForm ? "btn-amber" : "btn-red",
                  "group h-fit"
                )}
              >
                {loading ? (
                  <svg
                    className='w-5 h-5 text-white animate-spin'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx={12}
                      cy={12}
                      r={10}
                      stroke='currentColor'
                      strokeWidth={4}
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                ) : requestOk ? (
                  <>
                    <CheckIcon className='w-4 h-4 mr-1 duration-300 group-active:text-white' />
                    {t("sent")}
                  </>
                ) : validForm ? (
                  <>
                    <CloudUploadIcon className='w-4 h-4 mr-1 duration-300 group-active:text-white' />
                    {t("send")}
                  </>
                ) : (
                  <>
                    <XCircleIcon className='w-4 h-4 mr-1 duration-300 group-active:text-white' />
                    {t("invalid")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-grow px-4 py-3 pb-6 bg-gray-100 dark:bg-gray-900 rounded-tl-xl md:flex-row'>
          <div className='flex flex-col w-full px-2 space-y-3 md:w-1/2'>
            <label>
              <h4
                className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300">
                {t("title")}
              </h4>
              <input
                type='text'
                className='bg-gray-200 input disabled:bg-gray-300 disabled:cursor-not-allowed'
                placeholder={t("title")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled
              ></input>
            </label>
            <label className='flex flex-col grow'>
              <h4
                className="mb-1 text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-red-500 text-gray-700 font-marianne dark:text-gray-300">
                {t("description")}
              </h4>
              <textarea
                className='bg-gray-200 input grow'
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                value={description}
                placeholder={t("description")}
              ></textarea>
            </label>
          </div>
          <div className='flex flex-col w-full px-2 space-y-3 md:w-1/2'>
            <label className='flex flex-col'>
              <h4 className='mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 font-marianne'>
                {t("visibility")}
              </h4>
              <div className='inline-flex items-center my-2 space-x-3'>
                <input
                  type='checkbox'
                  defaultChecked={privateGroup as unknown as boolean}
                  value={privateGroup as unknown as string}
                  onChange={(e) => setPrivateGroup(e.target.checked)}
                  className='w-4 h-4 duration-200 border-0 rounded-md appearance-none bg-amber-200 form-checkbox hover:bg-amber-400 dark:bg-amber-800 dark:hover:bg-amber-700 checked:bg-amber-600 checked:border-transparent focus:outline-none focus:bg-amber-400 dark:focus:bg-amber-900 dark:focus:checked:bg-amber-300 ring-amber-500 dark:checked:bg-amber-300'
                />
                <span className='text-sm font-semibold text-gray-700 font-spectral dark:text-gray-300 '>
                  {t("private")}
                </span>
              </div>
            </label>
            {privateGroup && (
              <label>
                <h4
                  className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300">
                  {t("members")}
                </h4>
                <Select
                  name='members'
                  className='w-full'
                  value={members}
                  isMulti
                  placeholder={
                    <div className='text-sm font-semibold font-spectral'>
                      {t("members-placeholder")}
                    </div>
                  }
                  options={membersOptions}
                  formatOptionLabel={(member: MemberValue) => (
                    <div className='inline-flex items-center'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.photoURL}
                        alt={member.label}
                        className='w-5 h-5 mr-2 rounded-full'
                      />
                      <span className='text-xs text-gray-700 font-marianne'>
                        {member.label}
                      </span>
                    </div>
                  )}
                  onChange={(value) => setMembers(value)}
                />
              </label>
            )}
            <h4 className='mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 font-marianne'>
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
      <Transition appear show={deleteModalOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-50 overflow-y-auto'
          onClose={() => setDeleteModalOpen(false)}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-70' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900 font-marianne'
                >
                  {t("edit-delete-title", { slug: props.slug })}
                </Dialog.Title>
                <div className='mt-6'>
                  <p className='text-sm text-gray-500 font-spectral'>
                    {t("edit-delete-text")}
                    <br />
                    {t("edit-delete-text2")}
                  </p>
                </div>

                <div className='inline-flex items-center justify-end w-full mt-4 space-x-3'>
                  <button
                    type='button'
                    className='btn-red'
                    onClick={deleteChannel}
                  >
                    <TrashIcon className='w-4 h-4 mr-2' />
                    {t("delete")}
                  </button>
                  <button
                    type='button'
                    className='btn-gray'
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    <XIcon className='w-4 h-4 mr-2' />
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
};

export default ChannelEdit;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user }
  } = context.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login"
      }
    };
  try {
    const parsedUser = JSON.parse(user);
    const channel: Channel = (
      await (
        await fetchRSR(
          "http://localhost:3000/api/channel/" + context.params.slug,
          parsedUser?.session
        )
      ).json()
    )?.data?.attributes;

    if (!channel)
      return {
        redirect: {
          permanent: false,
          destination: "/channel"
        }
      };
    if (channel.owner.uid !== parsedUser?.data.uid)
      return {
        redirect: {
          permanent: false,
          destination: "/channel"
        }
      };

    const membersOptionsBody = await (
      await fetch("http://localhost:3000/api/user")
    ).json();

    return {
      props: {
        ...channel,
        members: channel.members
          .filter((m) => m.uid !== parsedUser?.data.uid)
          .map((m: UserMinimum) => ({
            value: m.uid,
            label: m.fullName,
            photoURL: m.photoURL
          })),
        membersOptions: membersOptionsBody.data.attributes
          .filter((m: UserMinimum) => m.uid !== parsedUser?.data.uid)
          .map((m: UserMinimum) => ({
            value: m.uid,
            label: m.fullName,
            photoURL: m.photoURL
          })),
        i18n: (await import(`../../../i18n/${context.locale}.json`)).default
      }
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }
};
