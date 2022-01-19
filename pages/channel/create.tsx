import { AppLayout } from "@components/layouts/AppLayout";
import {
  CheckIcon,
  CloudUploadIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { classes } from "@utils/classes";
import { fetchRSR } from "@utils/fetchRSR";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import slug from "slug";

const Select: any = dynamic(() => import("react-select") as any, {
  ssr: false,
});

const ChannelCreate: NextPage<any> = ({
  membersOptions,
}: {
  membersOptions: { fullName: string; uid: string; photoURL: string }[];
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const [pictureUrl, setPictureUrl] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [privateGroup, setPrivateGroup] = useState<boolean>(false);

  const [members, setMembers] = useState<
    { value: string; label: string; photoURL: string }[]
  >([]);

  const [validForm, setValidForm] = useState<boolean>(false);
  const [requestOk, setRequestOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validForm) {
      setLoading(true);
      try {
        const response = await fetchRSR("/api/channel/create", user?.session, {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            visibility: privateGroup ? "private" : "public",
            photoURL: pictureUrl,
            members: members.map((member) => ({
              uid: member.value,
              photoURL: member.photoURL,
              fullName: member.label,
            })),
          }),
        });

        const body = await response.json();
        if (response.ok && pictureFile) {
          const fd = new FormData();
          fd.append("file", pictureFile);
          fd.append("name", pictureFile.name);
          fd.append("type", pictureFile.type);
          fd.append("size", pictureFile.size.toString());
          const responseFileUpload = await fetch(
            `/api/channel/${body.data.attributes.slug}/upload`,
            {
              method: "POST",
              body: fd,
            }
          );
          if (!responseFileUpload.ok) {
            setRequestOk(false);
          } else {
            router.push(`/resource/${body.data.attributes.slug}`);
            setRequestOk(true);
          }
        } else if (response.ok && !pictureFile) {
          router.push(`/resource/${body.data.attributes.slug}`);
          setRequestOk(true);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  // Form validations
  useEffect(() => {
    console.table([pictureUrl, name, description, members]);
    if (name && description && members.length > 0) {
      setValidForm(true);
    } else setValidForm(false);
  }, [pictureUrl, name, description, members]);

  return (
    <AppLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900 grow"
      >
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end justify-between w-full">
            <div className="flex flex-col space-y-2">
              <div className="w-auto h-auto">
                <Image src="/img/partypopper.png" width={64} height={64} alt="Partypopper" />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                Créer
                {name ? (
                  <span className="ml-1 text-green-600 dark:text-green-400">
                    {slug(name)}
                  </span>
                ) : (
                  <span className="inline-flex items-center ml-1">
                    un
                    <span className="ml-1 text-green-600 dark:text-green-400">
                      salon
                    </span>
                  </span>
                )}
              </h3>
            </div>
            <button
              type="submit"
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
                  <CheckIcon className="w-4 h-4 mr-1 text-green-700 duration-300 group-active:text-white" />{" "}
                  Envoyé
                </>
              ) : validForm ? (
                <>
                  <CloudUploadIcon className="w-4 h-4 mr-1 text-green-700 duration-300 group-active:text-white" />
                  Envoyer
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4 mr-1 text-red-700 duration-300 group-active:text-white" />{" "}
                  Non valide
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-grow px-4 py-3 pb-6 bg-gray-100 rounded-tl-xl md:flex-row">
          <div className="flex flex-col w-full px-2 space-y-3 md:w-1/2">
            <label>
              <h4 className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne">
                Nom du salon
              </h4>
              <input
                type="text"
                className="bg-gray-200 input"
                placeholder="Titre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </label>
            <label>
              <h4 className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne">
                Membres
              </h4>
              <Select
                name="members"
                className="w-full"
                isMulti
                placeholder={
                  <div className="text-sm font-semibold font-spectral">
                    Qui souhaitez-vous inviter ?
                  </div>
                }
                options={membersOptions.map((member) => ({
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
                    <span className="text-xs font-marianne">
                      {member.label}
                    </span>
                  </div>
                )}
                onChange={(value) => setMembers(value)}
              />
            </label>
            <label className="flex flex-col grow">
              <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                Image du salon
              </h4>
              {pictureUrl && (
                <div className="relative w-full grow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pictureUrl}
                    className="object-cover object-center w-full rounded-lg aspect-video"
                    alt="Event picture"
                  ></img>
                  <div
                    className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 -mt-1 -mr-1 text-red-700 transition duration-300 bg-red-200 rounded-full cursor-pointer hover:bg-red-300"
                    onClick={() => {
                      setPictureUrl(null);
                      setPictureFile(null);
                    }}
                  >
                    <XIcon className="w-3 h-3 stroke-2"></XIcon>
                  </div>
                </div>
              )}
              {!pictureUrl && (
                <div className="w-full grow">
                  <input
                    id="filePicture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      let file =
                        e.target.files instanceof FileList
                          ? e.target.files[0]
                          : null;
                      if (file) {
                        setPictureFile(file);
                        setPictureUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  ></input>
                  <label
                    htmlFor="filePicture"
                    className="relative flex flex-col items-center justify-center w-full h-full p-12 duration-300 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>

                    <span className="block mt-2 text-sm font-medium text-gray-900">
                      Ajouter une image
                    </span>
                  </label>
                </div>
              )}
            </label>
          </div>
          <div className="flex flex-col w-full px-2 space-y-3 md:w-1/2">
            <label className="flex flex-col">
              <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                Confidentialité du salon
              </h4>
              <div className="inline-flex items-center my-2 space-x-3">
                <input
                  type="checkbox"
                  value={privateGroup as unknown as string}
                  onChange={(e) => setPrivateGroup(e.target.checked)}
                  className="w-4 h-4 duration-200 bg-green-200 border-0 rounded-md appearance-none form-checkbox hover:bg-green-400 dark:bg-green-800 dark:hover:bg-green-700 checked:bg-green-600 checked:border-transparent focus:outline-none focus:bg-green-400 dark:focus:bg-green-900 ring-green-500"
                />
                <span className="text-sm font-semibold text-gray-700 font-spectral dark:text-gray-300">
                  Salon restreint
                </span>
              </div>
            </label>
            <label className="flex flex-col grow">
              <h4 className="mb-1 text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-red-500 text-gray-700 font-marianne">
                Description du salon
              </h4>
              <textarea
                className="bg-gray-200 input grow"
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                value={description}
                placeholder="Description"
              ></textarea>
            </label>
          </div>
        </div>
      </form>
    </AppLayout>
  );
};

export default ChannelCreate;

export async function getServerSideProps() {
  const users = await (await fetch("http://localhost:3000/api/user")).json();

  return {
    props: {
      membersOptions: users?.data?.attributes,
    },
  };
}
