import { Sidebar } from "@components/channel/Sidebar";
import { AppLayout } from "@components/layouts/AppLayout";
import {
  InformationCircleIcon,
  PaperAirplaneIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

import slug from "slug";
import dynamic from "next/dynamic";

const Select: any = dynamic(() => import("react-select") as any, {
  ssr: false,
});

const ChannelCreate: NextPage<any> = () => {
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  const [description, setDescription] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]); // uidlist
  const [membersOptions, setMembersOptions] = useState<
    { fullName: string; uid: string; photoURL: string }[]
  >([
    {
      fullName: "John Doe",
      uid: "uid-1",
      photoURL: "https://picsum.photos/200",
    },
    {
      fullName: "Jane Doe",
      uid: "uid-2",
      photoURL: "https://picsum.photos/201",
    },
    {
      fullName: "Jack Doe",
      uid: "uid-3",
      photoURL: "https://picsum.photos/202",
    },
  ]);

  return (
    <AppLayout sidebar={{ size: "small" }}>
      <div className="flex flex-col w-full h-full max-h-[calc(100vh-4rem)] xl:flex-row">
        <Sidebar
          channels={[]}
          canExpand={false}
          isExpanded={false}
          canReturn
          isCreatingChannel
        />
        <div className="flex justify-center w-full h-full ">
          <div className="flex flex-col w-full mx-auto bg-gray-700 ">
            {/* HEADER */}
            <div className="inline-flex justify-between w-full p-3 px-6">
              <div className="flex flex-col ">
                <div className="inline-flex items-center">
                  <p className="text-xl font-medium text-gray-100 font-marianne">
                    {"#" + (name !== "" ? slug(name) : "créer-un-salon")}
                  </p>
                </div>

                <p className="text-sm font-light text-gray-300 font-spectral">
                  Échangeons tous ensemble.
                </p>
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col flex-grow p-3 space-y-4 overflow-y-auto bg-white xl:ml-6 xl:rounded-l-xl xl:p-6">
              <div className="relative flex flex-col">
                {pictureUrl && (
                  <div className="relative w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pictureUrl}
                      className="object-cover object-center w-full rounded-lg max-h-48"
                      alt="Event picture"
                    ></img>
                    <div
                      className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 -mt-1 -mr-1 text-red-700 transition duration-300 bg-red-200 rounded-full cursor-pointer hover:bg-red-300"
                      onClick={() => {
                        setPictureUrl(null);
                        setPicture(null);
                      }}
                    >
                      <XIcon className="w-3 h-3 stroke-2"></XIcon>
                    </div>
                  </div>
                )}
                {!pictureUrl && (
                  <div className="w-full">
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
                          setPicture(file);
                          setPictureUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    ></input>
                    <label
                      htmlFor="filePicture"
                      className="relative block w-full p-12 text-center duration-300 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              </div>
              <div className="relative flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm leading-7 text-gray-600 font-marianne dark:text-gray-400"
                >
                  Nom du salon
                </label>
                <div className="inline-flex items-center space-x-2">
                  <span className="flex items-center justify-center flex-shrink-0 w-[2.25rem] h-[2.25rem] bg-blue-200 rounded-lg dark:bg-blue-900">
                    <InformationCircleIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="relative flex flex-col">
                <label
                  htmlFor="members"
                  className="text-sm leading-7 text-gray-600 font-marianne dark:text-gray-400"
                >
                  Membre(s) du salon
                </label>
                <div className="inline-flex items-center space-x-2">
                  <span className="flex items-center justify-center flex-shrink-0 w-[2.25rem] h-[2.25rem] bg-blue-200 rounded-lg dark:bg-blue-900">
                    <UsersIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </span>
                  <Select
                    name="members"
                    className="w-full"
                    isMulti
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
                  />
                </div>
              </div>
              <div className="relative flex flex-col">
                <label
                  htmlFor="description"
                  className="text-sm leading-7 text-gray-600 font-marianne dark:text-gray-400"
                >
                  Description du salon
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="inline-flex justify-end w-full p-3 px-6">
              <button className="btn-blue">
                <PaperAirplaneIcon className="w-4 h-4 mr-1 -mt-1 rotate-45" />
                Créer
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChannelCreate;
