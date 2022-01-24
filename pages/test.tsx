/* eslint-disable @next/next/no-img-element */
import { AppLayout } from "@components/layouts/AppLayout";
import { Sidebar } from "@components/channel/Sidebar";
import Link from "next/link";
import {
  ChatAlt2Icon,
  ChatIcon,
  PaperAirplaneIcon,
  PencilIcon,
  PlusIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import { fakeResource, fakeUserMin } from "@utils/faker.dev";
import { UserMinimum } from "@definitions/User";
import { Resource } from "@definitions/Resource/Resource";
import { formatDistance } from "date-fns";
import fr from "date-fns/locale/fr";
import { Iframe } from "@components/helpers/Iframe";
import { HistoryItem } from "@components/channel/HistoryItem";

export default function TestPage() {
  const slug = "hello";
  const description = "ccouocu";

  const messages = [
    {
      _id: "61e1443e14218b390d496a1a",
      user: {
        fullName: "John Doe",
        photoURL: "https://i.pravatar.cc/500",
        uid: "1234567890",
      },
      data: {
        type: "message",
        text: "eded",
      },
      createdAt: "2022-01-14T09:37:02.134Z",
    },
    {
      _id: "61e1443e14218b390d496a1b",
      user: {
        fullName: "Jane Due",
        photoURL: "https://i.pravatar.cc/501",
        uid: "1234567890",
      },
      data: {
        type: "message",
        text: "ededu",
      },
      createdAt: "2022-01-15T09:37:02.134Z",
    },
  ];

  const activities = [
    {
      _id: "61e1443e14218b390d496a1d",
      user: {
        fullName: "Jone Ricard",
        photoURL: "https://i.pravatar.cc/502",
        uid: "1234567890",
      },
      data: {
        type: "comment",
        resource: fakeResource(),
        text: "la ressource est bien",
      },
      createdAt: "2022-01-14T09:37:02.134Z",
    },
    {
      _id: "61e1443e14218b390d496a1c",
      user: {
        fullName: "Jane Due",
        photoURL: "https://i.pravatar.cc/501",
        uid: "1234567890",
      },
      data: {
        type: "invite",
        user: fakeUserMin(),
      },
      createdAt: "2022-01-13T09:37:02.134Z",
    },
    {
      _id: "61e1443e14218b390d496a1c",
      user: {
        fullName: "Jane Due",
        photoURL: "https://i.pravatar.cc/501",
        uid: "1234567890",
      },
      data: {
        type: "resource_create",
        resource: { ...fakeResource(), slug: "une-ressource-tres-cool" },
      },
      createdAt: "2021-01-13T09:37:02.134Z",
    },
  ];

  const history = [...messages, ...activities].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full max-h-[calc(100vh-4rem)] xl:flex-row ">
        <Sidebar
          channels={[]}
          canExpand
          isExpanded={false}
          canReturn
          selectedChannelSlug={slug as string}
        />
        <div className="flex justify-center w-full h-full">
          <div className="flex flex-col w-full h-full bg-gray-700">
            {/* HEADER */}
            <div className="inline-flex justify-between w-full p-3 px-6">
              <div className="flex flex-col ">
                <div className="inline-flex items-center">
                  <p className="text-xl font-medium text-gray-100 font-marianne">
                    {"#" + slug}
                  </p>
                </div>
                {description && (
                  <p className="text-sm font-light text-gray-300 font-spectral">
                    {description}
                  </p>
                )}
              </div>
              <div className="inline-flex items-center space-x-3">
                <Link href={`/channel/${slug}/edit`}>
                  <a className="btn-green">
                    <PencilIcon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:block">Éditer le salon</span>
                  </a>
                </Link>
                <Link href={"/resource/create" + `?channel=${slug}`}>
                  <a className="btn-blue">
                    <PlusIcon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:block">
                      Poster une ressource
                    </span>
                  </a>
                </Link>
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col p-3 space-y-4 overflow-y-auto bg-white grow md:max-h-full xl:ml-6 xl:rounded-l-xl xl:p-6">
              <ol className="relative border-l border-gray-200 h-fit dark:border-gray-700">
                {history.map((item, index) => (
                  <HistoryItem
                    {...item}
                    key={index}
                    context={{ name: "channel plutot cool" }}
                  />
                ))}
              </ol>
            </div>

            {/* FOOTER */}
            <form
              // onSubmit={handleSubmitMessage}
              className="inline-flex items-center w-full p-3 px-6"
            >
              <input
                // value={message}
                // onChange={(e) => setMessage(e.target.value)}
                className="z-40 mr-2 input"
              />
              <button className="btn-blue">
                <PaperAirplaneIcon className="w-[1.25rem] h-[1.25rem] " />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

