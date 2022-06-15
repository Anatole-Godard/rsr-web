/* eslint-disable @next/next/no-img-element */
import { AppLayout } from "@components/layouts/AppLayout";
import { Resource } from "@definitions/Resource";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  ExclamationIcon,
  HeartIcon as HeartIconOutline,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
  EyeIcon,
  CalculatorIcon,
  MenuAlt2Icon,
  CheckCircleIcon,
  DownloadIcon,
  ChevronRightIcon,
  VideoCameraIcon,
  VolumeUpIcon,
  DocumentIcon,
} from "@heroicons/react/outline";
import {
  HandIcon,
  HeartIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { GetServerSideProps, NextPage } from "next";
import { Fragment, Key, useState } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ChipList } from "@components/ui/ChipList";
import { fetchRSR } from "libs/fetchRSR";
import { useAuth } from "@hooks/useAuth";
import { UserMinimum } from "@definitions/User";
import { Comment } from "@definitions/Resource/Comment";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { classes } from "libs/classes";
import { format, formatDistance, formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { types, visibilities } from "constants/resourcesTypes";
import { AvatarGroup } from "@components/ui/AvatarGroup";
import { GeoJSON_Point } from "@definitions/Resource/GeoJSON";
import { ExternalLink } from "@definitions/Resource/ExternalLink";
import { PhysicalItem } from "@definitions/Resource/PhysicalItem";
import Image from "next/image";
import { Event } from "@definitions/Resource/Event";

import "react-nice-dates/build/style.css";
import { DateRangePickerCalendar } from "react-nice-dates";
import { ShowMoreText } from "@components/ui/ShowMore";
import { PlaylistDropdown } from "@components/dropdowns/PlaylistDropdown";
import { TagDocument } from "@definitions/Resource/Tag";
import { Other } from "@definitions/Resource/Other";
import { toModularInput } from "@utils/toModularInput";
import { useCarousel } from "@hooks/useCarousel";
import { useEventListener } from "@hooks/useEventListener";

const Map: any = dynamic(() => import("@components/map/Map") as any, {
  ssr: false,
});

const ResourceSlug: NextPage<any> = ({
  slug,
  data,
  owner,
  description,
  comments,
  likes,
  tags,
  validated,
  visibility,
  seenBy,
  createdAt,
  updatedAt,
}: Resource) => {
  const [message, setMessage] = useState<string>("");
  const [newLikes, setNewLikes] = useState<UserMinimum[]>(likes || []);
  const [newComments, setNewComments] = useState<Comment[]>(comments || []);
  const [newViews, setNewViews] = useState<UserMinimum[]>(seenBy || []);

  const { user } = useAuth();
  const report = async () => {
    const res = await fetchRSR(`/api/report/create`, user?.session, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "web",
      },
      body: JSON.stringify({
        type: "resource",
        documentUid: slug,
        context: slug,
      }),
    });
    if (res.ok) {
      const body = await res.json();
      console.log(body);
    }
  };

  const like = async () => {
    const res = await fetchRSR(`/api/resource/${slug}/like`, user?.session);
    if (res.ok) {
      const body = await res.json();
      setNewLikes(body?.data.attributes.likes);
    }
  };

  const comment = async (e) => {
    e.preventDefault();
    const res = await fetchRSR(`/api/resource/${slug}/comment`, user?.session, {
      method: "POST",
      body: JSON.stringify({
        commentContent: message,
      }),
    });
    if (res.ok) {
      const body = await res.json();
      setNewComments(body?.data.attributes.comments);
      setMessage("");
    }
  };

  return (
    <AppLayout>
      <section className="flex flex-col w-full bg-gray-100 h-fit dark:bg-gray-900">
        {/* 2xl:sticky 2xl:top-0 z-[47] */}
        <div className="flex flex-col w-full px-6 py-6 bg-white border-b border-gray-200 lg:px-24 dark:bg-black dark:border-gray-800">
          <Link href="/resource">
            <a className="mb-1 text-xs btn-gray w-max">
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Retour
            </a>
          </Link>
          <div className="flex flex-col space-y-3 lg:divide-x font-spectral lg:h-10 lg:items-center lg:flex-row lg:space-x-2 lg:space-y-0">
            <div className="inline-flex text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
              {types
                .find((t) => t.value === data?.type)
                ?.icon.outline({ className: "w-4 h-4 mx-1 shrink-0" })}
              {types.find((t) => t.value === data?.type)?.label}
            </div>

            <div className="items-center hidden text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 mx-1 shrink-0" />
              {formatDistance(new Date(createdAt), new Date(), {
                addSuffix: true,
                locale: fr,
              })}
            </div>
            {newLikes.length >= 1 ? (
              <div className="items-center hidden text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
                <AvatarGroup users={newLikes} limit={5} />
                <UsersIcon className="hidden lg:flex items-center fas fa-users flex-shrink-0 mx-1.5 h-4 w-4 " />
                {newLikes?.length || 0}{" "}
                {newLikes?.length > 1 ? "personnes aiment" : "personne aime"}
              </div>
            ) : (
              <div className="items-center hidden text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
                <UsersIcon className="hidden lg:flex items-center fas fa-users flex-shrink-0 mx-1.5 h-4 w-4 " />

                {"Personne n'aime pour l'instant"}
              </div>
            )}
            <div className="items-center hidden text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
              {visibilities
                .find((v) => v.value === visibility)
                ?.icon.outline({ className: "w-4 h-4 mx-1 shrink-0" })}
              {visibilities.find((v) => v.value === visibility)?.label}
            </div>
            {user?.data.uid === owner.uid && !validated && (
              <div className="items-center hidden pl-1 text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
                En attente de validation
              </div>
            )}
            {newViews.length >= 1 ? (
              <div className="items-center hidden text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
                <EyeIcon className="hidden lg:flex items-center fas fa-users flex-shrink-0 mx-1.5 h-4 w-4 " />
                {newViews?.length || 0} {newViews?.length > 1 ? "vues" : "vue"}
              </div>
            ) : (
              <div className="items-center hidden text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
                <EyeIcon className="hidden lg:flex items-center fas fa-users flex-shrink-0 mx-1.5 h-4 w-4 " />

                {"Personne n'a vu pour l'instant"}
              </div>
            )}
          </div>

          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="mb-2 text-3xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              {data.attributes.properties.name}
            </h2>
            <div className="flex mt-2 space-x-3 lg:mt-0 lg:ml-4">
              {!newLikes.find((l) => l.uid === user?.data.uid) ? (
                <button className="btn-red " key="likeBtn" onClick={like}>
                  <HeartIconOutline className="w-4 h-4 select-none md:mr-1 shrink-0" />
                  <span className="hidden md:flex">{"J'aime"}</span>
                </button>
              ) : (
                <button className="btn-red" key="dislikeBtn" onClick={like}>
                  <HeartIcon className="w-4 h-4 select-none md:mr-1 shrink-0" />
                  <span className="hidden md:flex">{"Je n'aime plus"}</span>
                </button>
              )}

              {user?.data && (
                <>
                  <PlaylistDropdown
                    resource={{
                      slug,
                      owner,
                      createdAt,
                      data,
                      validated,
                      visibility,
                      seenBy,
                    }}
                  />
                  <button onClick={report} className="btn-yellow">
                    <ExclamationIcon className="w-4 h-4 select-none md:mr-1 shrink-0" />
                    <span className="hidden md:flex">Signaler</span>
                  </button>
                </>
              )}
              {owner.uid === user?.data.uid && (
                <Link href={"/resource/" + slug + "/edit"}>
                  <a className="btn-gray">
                    <PencilIcon className="w-4 h-4 select-none md:mr-1 shrink-0" />
                    <span className="hidden md:flex">Éditer</span>
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="inline-flex w-full pt-2 pb-2 text-sm prose text-justify text-gray-500 font-spectral dark:text-gray-400">
            <ShowMoreText
              /* Default options */
              lines={3}
              more="Voir plus"
              less="Voir moins"
              className="w-full grow"
              anchorClass="text-bleuFrance-500 dark:text-bleuFrance-300 underline"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {description}
            </ShowMoreText>
          </div>
          <div className="inline-flex pt-3 -ml-2 overflow-x-hidden md:pt-0">
            <ChipList
              color={
                data.type === "location"
                  ? "blue"
                  : data.type === "physical_item"
                  ? "emerald"
                  : data.type === "event"
                  ? "red"
                  : "amber"
              }
              size="normal"
              list={(tags as TagDocument[]).map((tag: TagDocument) => ({
                label: tag.name,
                value: tag._id.toString(),
                validated: tag.validated,
              }))}
            />
          </div>
        </div>
        <div className="flex flex-col w-full h-full px-6 pt-2 pb-6 space-y-3 grow lg:px-24">
          <Tab.Group>
            <Tab.List className="flex flex-col p-2 space-y-1 bg-white lg:flex-row lg:space-y-0 lg:space-x-3 dark:bg-black rounded-xl">
              <Tab
                className={({ selected }) =>
                  classes(
                    "w-full py-2.5 text-sm leading-5 font-medium select-none font-spectral focus:outline-none duration-300 rounded-md ",
                    selected
                      ? data.type === "location"
                        ? "bg-blue-300 text-blue-700 dark:bg-blue-700 dark:text-blue-300"
                        : data.type === "physical_item"
                        ? "bg-emerald-300 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-300"
                        : data.type === "event"
                        ? "bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300"
                        : "bg-amber-300 text-amber-700 dark:bg-amber-700 dark:text-amber-300"
                      : "text-gray-500",

                    data.type === "location"
                      ? "hover:bg-blue-500 hover:text-blue-50"
                      : data.type === "physical_item"
                      ? "hover:bg-emerald-500 hover:text-emerald-50"
                      : data.type === "event"
                      ? "hover:bg-red-500 hover:text-red-50"
                      : "hover:bg-amber-500 hover:text-amber-50"
                  )
                }
              >
                Aperçu de la ressource
              </Tab>
              <Tab
                className={({ selected }) =>
                  classes(
                    "w-full py-2.5 text-sm leading-5 font-medium select-none font-spectral focus:outline-none duration-300 rounded-md",
                    selected
                      ? data.type === "location"
                        ? "bg-blue-300 text-blue-700 dark:bg-blue-700 dark:text-blue-300"
                        : data.type === "physical_item"
                        ? "bg-emerald-300 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-300"
                        : data.type === "event"
                        ? "bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300"
                        : "bg-amber-300 text-amber-700 dark:bg-amber-700 dark:text-amber-300"
                      : "text-gray-500",

                    data.type === "location"
                      ? "hover:bg-blue-500 hover:text-blue-50"
                      : data.type === "physical_item"
                      ? "hover:bg-emerald-500 hover:text-emerald-50"
                      : data.type === "event"
                      ? "hover:bg-red-500 hover:text-red-50"
                      : "hover:bg-amber-500 hover:text-amber-50"
                  )
                }
              >
                Commentaires
              </Tab>
            </Tab.List>
            <Tab.Panels className="p-2 bg-white max-h-max dark:bg-black rounded-xl focus:outline-none">
              <Tab.Panel className="max-h-[24rem] min-h-[24rem] h-full">
                <ResourceView {...data} slug={slug} updatedAt={updatedAt} />
              </Tab.Panel>
              <Tab.Panel className="max-h-[24rem] min-h-[24rem] h-full flex flex-col justify-between ">
                {newComments.length > 0 ? (
                  <ul className="relative h-full mx-2 my-2 overflow-x-visible overflow-y-scroll border-l border-gray-200 max-h-96 grow dark:border-gray-700">
                    {newComments.map((comment: Comment) => (
                      <CommentView
                        key={comment.createdAt.toString()}
                        comment={comment}
                        slug={slug}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="font-spectral">
                      Aucun commentaire pour le moment
                    </p>
                  </div>
                )}
                <form onSubmit={comment} className="inline-flex">
                  <input
                    value={message}
                    placeholder="Écrire un commentaire"
                    className="input grow"
                    required
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="ml-2 btn-bleuFrance shrink-0"
                  >
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Envoyer
                  </button>
                </form>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </AppLayout>
  );
};

export default ResourceSlug;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user },
  } = context.req;
  const uid = JSON.parse(user || "null")?.data.uid || undefined;
  const body = await (
    await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      }/resource/${context.params.slug}`,
      uid
        ? {
            headers: { uid },
          }
        : undefined
    )
  ).json();
  const parsedUser = JSON.parse(user || "null");
  if (parsedUser?.session)
    await fetchRSR(
      `http://localhost:3000/api/resource/${context.params.slug}/seen`,
      parsedUser.session
    );
  const resource: Resource[] = body?.data?.attributes;

  return {
    props: { ...resource },
  };
};

interface ResourceViewProps {
  type: Resource["data"]["type"];
  attributes: Resource["data"]["attributes"];
  slug: Resource["slug"];
  updatedAt: Resource["updatedAt"];
}

interface LocationViewProps {
  attributes: GeoJSON_Point;
  slug: string;
}
interface ExternalLinkViewProps {
  attributes: ExternalLink;
  slug: string;
  updatedAt: string;
}
interface PhysicalItemViewProps {
  attributes: PhysicalItem;
  slug: string;
  updatedAt: string;
}

interface EventViewProps {
  attributes: Event;
  slug: string;
  updatedAt: string;
}

interface OtherViewProps {
  attributes: Other;
  slug: string;
  updatedAt: string;
}

interface CommentViewProps {
  comment: Comment;
  slug: string;
}

const ResourceView = ({
  type,
  attributes,
  slug,
  updatedAt,
}: ResourceViewProps) => {
  return (
    <div className="grid h-full gap-6 min-h-max xl:grid-cols-3 md:grid-cols-2">
      {type === "location" && (
        <LocationView attributes={attributes} slug={slug} />
      )}
      {type === "physical_item" && (
        <PhysicalItemView
          attributes={attributes}
          slug={slug}
          updatedAt={updatedAt.toString()}
        />
      )}
      {type === "external_link" && (
        <ExternalLinkView
          attributes={attributes}
          slug={slug}
          updatedAt={updatedAt.toString()}
        />
      )}
      {type === "event" && (
        <EventView
          attributes={attributes}
          slug={slug}
          updatedAt={updatedAt.toString()}
        />
      )}
      {type === "other" && (
        <OtherView
          attributes={attributes}
          slug={slug}
          updatedAt={updatedAt.toString()}
        />
      )}
    </div>
  );
};

const LocationView = ({ attributes, slug }: LocationViewProps) => {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        <Map
          point={attributes.geometry.coordinates}
          className="h-full"
          zoom={13}
          mapEventHandler={{ click: () => {} }}
        />
      </div>
      <div className="flex flex-col pt-6">
        <h4 className="mb-3 text-3xl font-bold font-marianne">Adresse</h4>
        <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
          {attributes.properties.location}
        </div>
      </div>
    </>
  );
};

const ExternalLinkView = ({
  attributes,
  slug,
  updatedAt,
}: ExternalLinkViewProps) => {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.medias ? (
          <MediaCarouselView medias={attributes.properties.medias} updatedAt />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-amber-800 bg-amber-200 dark:text-amber-200 dark:bg-amber-800">
            <LinkIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Lien externe</p>
            {!attributes.properties.medias && (
              <p className="pt-2 mx-12 mt-2 text-sm text-center border-t border-amber-500 text-amber-600 dark:text-amber-400 font-spectral">
                {"Aucun média n'est disponible pour cette ressource"}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="">
        <div className="flex flex-col pt-6">
          <h4 className="mb-3 text-3xl font-bold font-marianne">
            Lien hypertexte
          </h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            <a
              className="underline text-amber-800 dark:text-amber-200"
              href={attributes.properties.url}
            >
              {attributes.properties.url}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const PhysicalItemView = ({
  attributes,
  slug,
  updatedAt,
}: PhysicalItemViewProps) => {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.medias ? (
          <MediaCarouselView
            medias={attributes.properties.medias}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-emerald-800 bg-emerald-200 dark:text-emerald-200 dark:bg-emerald-800">
            <HandIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Objet physique</p>
            {!attributes.properties.medias && (
              <p className="pt-2 mx-12 mt-2 text-sm text-center border-t border-emerald-500 text-emerald-600 dark:text-emerald-400 font-spectral">
                {"Aucun média n'est disponible pour cette ressource"}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="">
        <div className="flex flex-col pt-6">
          <h4 className="mb-3 text-3xl font-bold font-marianne">Catégorie</h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            {attributes.properties.category}
          </div>
        </div>
        <div className="flex flex-col pt-6">
          <h4 className="mb-3 text-3xl font-bold font-marianne">Prix</h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            {attributes.properties.price}
          </div>
        </div>
      </div>
    </>
  );
};

const EventView = ({ attributes, slug, updatedAt }: EventViewProps) => {
  const { user } = useAuth();
  const participate = async () => {
    const res = await fetchRSR(
      `/api/resource/${slug}/participate`,
      user?.session
    );
    const body = await res.json();
    res.ok
      ? setParticipants(
          body.data.attributes.data.attributes.properties.participants
        )
      : console.error(body);
  };
  const [participants, setParticipants] = useState<UserMinimum[]>(
    attributes.properties.participants || []
  );

  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        {/* <DateRange
          onChange={() => {}}
          editableDateInputs={false}
          ranges={{
            startDate: new Date(attributes.properties.startDate.toString()),
            ...(attributes.properties.endDate
              ? { endDate: new Date(attributes.properties.endDate.toString()) }
              : null),
          }}
          direction="horizontal"
        /> */}
        <DateRangePickerCalendar
          startDate={new Date(attributes.properties.startDate.toString())}
          endDate={
            attributes.properties.endDate
              ? new Date(attributes.properties.endDate.toString())
              : null
          }
          locale={fr}
        />
      </div>
      <div className="flex flex-col pt-3 pr-3 space-y-3">
        {attributes.properties.medias ? (
          <MediaCarouselView
            medias={attributes.properties.medias}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-red-800 bg-red-200 rounded-lg dark:text-red-200 dark:bg-red-800">
            <CalendarIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Évenement</p>
          </div>
        )}
        <hr className="mt-3 border-gray-100 dark:border-gray-800" />
        <div className="flex flex-col p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex flex-col">
            <div className="inline-flex items-center justify-between w-full pt-2 pb-4 space-x-4 ">
              <span className="inline-flex items-center flex-grow space-x-4">
                {attributes.properties.endDate ? (
                  <div className="flex flex-col items-center w-6 ml-4 ">
                    <ClockIcon className="w-4 h-4 text-center " />
                    <span className="text-[0.6rem] font-bold uppercase">
                      from
                    </span>
                  </div>
                ) : (
                  <ClockIcon className="w-6 h-6 ml-4 text-center" />
                )}

                <div className="flex flex-col">
                  <p className="text-xs first-letter:uppercase">
                    {format(new Date(attributes.properties.startDate), "PPPP", {
                      locale: fr,
                    })}
                  </p>
                  <p className="text-sm font-bold">
                    {format(new Date(attributes.properties.startDate), "p", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </span>
              <a
                rel="noreferrer"
                href={
                  "https://calendar.google.com/calendar/render?action=TEMPLATE&" +
                  `dates=${format(
                    new Date(attributes.properties.startDate),
                    "yyyyMMdd'T'HHmmss'Z'"
                  )}${
                    attributes.properties.endDate
                      ? "%2F" +
                        format(
                          new Date(attributes.properties.endDate),
                          "yyyyMMdd'T'HHmmss'Z'"
                        )
                      : ""
                  }&text=${attributes.properties.name}`
                }
                target="_blank"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/768px-Google_Calendar_icon_%282020%29.svg.png"
                  className="h-6 px-3 text-center shrink-0"
                  alt="GCalendar"
                ></img>
              </a>
            </div>

            {attributes.properties.endDate && (
              <div className="inline-flex items-center justify-between w-full pt-2 pb-4 space-x-4 ">
                <span className="inline-flex items-center flex-grow space-x-4">
                  <div className="flex flex-col items-center w-6 ml-4 ">
                    <ClockIcon className="w-4 h-4 text-center" />
                    <span className="text-[0.6rem] text-center font-bold uppercase">
                      to
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-xs first-letter:uppercase">
                      {format(new Date(attributes.properties.endDate), "PPPP", {
                        locale: fr,
                      })}
                    </p>
                    <p className="text-sm font-bold">
                      {format(new Date(attributes.properties.endDate), "p", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </span>
              </div>
            )}
          </div>
        </div>
        <hr className="mt-3 border-gray-100 dark:border-gray-800" />
        <div className="flex flex-col p-3 space-y-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="inline-flex items-center justify-between">
            <h4 className="text-lg font-bold font-spectral">
              {participants.length.toString() +
                " " +
                (participants.length > 1 ? "participants" : "participant")}
            </h4>

            {user ? (
              participants.find((p) => p.uid === user.data.uid) ? (
                <button
                  onClick={participate}
                  className="px-2 py-1 text-xs btn-text-gray"
                >
                  <XIcon className="w-4 h-4 mr-1" />
                  Retirer ma participation
                </button>
              ) : (
                <button
                  onClick={participate}
                  className="px-2 py-1 text-xs btn-text-gray"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-1" />
                  Participer
                </button>
              )
            ) : (
              <Link href="/auth/login">
                <a className="px-2 py-1 text-xs btn-text-gray">
                  <UserIcon className="w-4 h-4 mr-1" />
                  Se connecter
                </a>
              </Link>
            )}
          </div>
          <AvatarGroup users={participants} xl />
        </div>
      </div>
    </>
  );
};

const OtherView = ({ attributes, slug, updatedAt }: OtherViewProps) => {
  return (
    <>
      <div className="relative min-h-[18rem] md:min-h-0 h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.medias ? (
          <MediaCarouselView
            medias={attributes.properties.medias}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-emerald-800 bg-emerald-200 dark:text-emerald-200 dark:bg-emerald-800">
            <HandIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Objet physique</p>
            {!attributes.properties.image && (
              <p className="pt-2 mx-12 mt-2 text-sm text-center border-t border-emerald-500 text-emerald-600 dark:text-emerald-400 font-spectral">
                {"Aucune image n'est disponible pour cette ressource"}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="">
        {toModularInput(attributes.properties).map((input, i) => (
          <Fragment key={input.slug + "-" + i}>
            <div className="flex flex-col mb-3 first:mt-6 ">
              <h4 className="inline-flex items-center space-x-2 text-2xl font-bold font-marianne">
                <span className="mb-1 ">{input.label}</span>
                {input.type === "string" && (
                  <span className="btn-bleuFrance text-xs px-1 py-0.5">
                    <MenuAlt2Icon className="w-3 h-3 mr-1" />
                    Texte
                  </span>
                )}
                {input.type === "date" && (
                  <span className="btn-bleuFrance text-xs px-1 py-0.5">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Date
                  </span>
                )}
                {input.type === "number" && (
                  <span className="btn-bleuFrance text-xs px-1 py-0.5">
                    <CalculatorIcon className="w-3 h-3 mr-1" />
                    Nombre
                  </span>
                )}
                {input.type === "boolean" && (
                  <span className="btn-bleuFrance text-xs px-1 py-0.5">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Oui/Non
                  </span>
                )}
              </h4>
              <p className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
                {input.type !== "boolean"
                  ? input.value
                  : input.value
                  ? "Oui"
                  : "Non"}
              </p>
            </div>
            <hr className="mx-5 mb-3 border-gray-300 dark:border-gray-700 last:border-0" />
          </Fragment>
        ))}
      </div>
    </>
  );
};

const CommentView = ({ comment, slug }: CommentViewProps) => {
  const { owner, content, createdAt } = comment;
  const { user } = useAuth();

  const report = async () => {
    const res = await fetchRSR(`/api/report/create`, user?.session, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "web",
      },
      body: JSON.stringify({
        type: "user",
        documentUid: owner.uid,
        context: `${owner.fullName}: ${content}`,
      }),
    });
    if (res.ok) {
      const body = await res.json();
      console.log(body);
    }
  };

  return (
    <li className="mb-6 ml-[2.25rem] last:pb-6">
      <span className="absolute  flex items-center justify-center w-[2.25rem] h-[2.25rem] bg-blue-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-blue-900">
        <Image
          className="z-10 rounded-full"
          src={owner.photoURL || "/uploads/user/default.png"}
          alt={owner.fullName}
          layout="fill"
        />
      </span>
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-2 pr-4 text-sm bg-white border border-gray-200 rounded-lg shadow-sm font-spectral dark:bg-gray-700 dark:border-gray-600">
          {content}
        </div>
        <div className="inline-flex items-center mt-px ml-1 space-x-1 text-gray-500">
          <span className="text-xs font-spectral">{owner.fullName} &bull;</span>

          <time className="text-xs font-spectral">
            {format(new Date(createdAt), "HH:mm, dd MMM yyyy", { locale: fr })}{" "}
            &bull;
          </time>
          <button
              onClick={report}
            className="inline-flex items-center text-xs text-yellow-600 duration-300 hover:text-yellow-800 font-spectral"
          >
            <ExclamationIcon className="w-3 h-3 mr-1 shrink-0" />
            Signaler
          </button>
          {owner.uid === user?.data.uid && (
            <>
              <span>&bull;</span>
              <button
                // todo
                className="inline-flex items-center text-xs text-red-600 duration-300 hover:text-red-800 font-spectral"
              >
                <TrashIcon className="w-3 h-3 mr-1 shrink-0" />
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

type Media = {
  name: string;
  type: string;
  size: string;
  url: string;
};

const INTERVAL = 10000;
const MediaCarouselView = ({ medias, updatedAt }) => {
  // const [active, setActive, handlers, style] = useCarousel(length, INTERVAL);
  const {
    active,
    previous,
    next,
    wrapperStyle,
    IndicatorsComponent,
  } = useCarousel(medias, INTERVAL);

  const [modalContent, setModalContent] = useState<Media | undefined>(
    undefined
  );

  return (
    medias.length > 0 && (
      <>
        <div className="relative min-h-[12rem] h-full group">
          <IndicatorsComponent />
          <div
            className="bg-opacity-25 bg-gradient-to-b from-black to-black via-transparent min-h-[12rem] z-[6]"
            style={wrapperStyle}
            onClick={() => setModalContent(active as Media)}
          >
            <MediaView {...(active as Media)} />
          </div>
          <div className="absolute w-full h-1/3 z-[7] bg-gradient-to-b from-gray-800 to-transparent top-0 left-0"></div>
          <div className="transition-all duration-200 absolute w-full h-1/3 z-[9] bg-gradient-to-t from-gray-800 to-transparent bottom-0 left-0 group-hover:opacity-100 opacity-0 flex flex-col justify-end pb-3 px-3">
            <p className="text-xl font-extrabold text-white font-marianne">
              {(active as Media).name}
            </p>
            <p className="text-xs text-gray-400 font-spectral">
              mis à jour{" "}
              {formatRelative(new Date(updatedAt), new Date(), { locale: fr })}
            </p>
          </div>

          <div
            className="absolute left-0 top-[calc(50%-4rem)] z-[8] p-12 cursor-pointer text-white opacity-60 duration-200 hover:opacity-100"
            onClick={previous}
          >
            <ChevronLeftIcon className="w-12 h-12" />
          </div>
          <div
            className="absolute right-0 top-[calc(50%-4rem)] z-[8] p-12 cursor-pointer text-white opacity-60 duration-200 hover:opacity-100"
            onClick={next}
          >
            <ChevronRightIcon className="w-12 h-12" />
          </div>
        </div>
        {modalContent && (
          <MediaModal
            media={modalContent}
            onClose={() => {
              setModalContent(undefined);
            }}
            updatedAt={updatedAt}
          />
        )}
      </>
    )
  );
};

const MediaView = ({ name, url, type }: Media) => {
  return (
    <div className="relative flex flex-col w-full h-full rounded-md sm:rounded-lg ">
      {type.includes("image") && (
        <Image src={url} alt={name} layout="fill" objectFit="cover" />
      )}
      {type.includes("audio") && (
        <div className="relative w-full h-full overflow-hidden bg-yellow-500">
          <img
            src="https://source.unsplash.com/random/?audio"
            className="z-[6] h-full xl:h-auto xl:w-full object-cover overflow-hidden absolute"
            alt="meeting"
          />

          <div className="absolute flex justify-center items-center h-full w-full bg-black bg-opacity-60 z-[8]">
            <VolumeUpIcon className="w-24 h-24 stroke-[1.5] text-white" />
          </div>
        </div>
      )}
      {type.includes("video") && (
        <div className="relative w-full h-full overflow-hidden bg-blue-500">
          <video
            autoPlay={false}
            muted
            className="z-[6] h-full xl:h-auto xl:w-full object-cover overflow-hidden absolute"
          >
            <source src={url} type={type} />
            Your browser does not support the audio element.
          </video>
          <div className="absolute flex justify-center items-center h-full w-full bg-black bg-opacity-60 z-[9]">
            <VideoCameraIcon className="w-24 h-24 stroke-[1.5] text-white" />
          </div>
        </div>
      )}
      {type.includes("application/pdf") && (
        <div className="relative w-full h-full overflow-hidden bg-green-500">
          <img
            src="https://source.unsplash.com/random/?document"
            className="z-[6] h-full xl:h-auto xl:w-full object-cover overflow-hidden absolute"
            alt="meeting"
          />

          <div className="absolute flex justify-center items-center h-full w-full bg-black bg-opacity-60 z-[8]">
            <DocumentIcon className="w-24 h-24 stroke-[1.5] text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

const MediaModal = ({
  onClose,
  media: { name, url, type, size },
  updatedAt,
}: {
  onClose: () => void;
  media: Media;
  updatedAt: string;
}) => {
  const download = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    link.remove();
  };

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  });

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full absolute  top-0 left-0  z-[61]">
                <div className="relative z-[61] top-0 left-0 w-full h-full">
                  {type.includes("image") && (
                    <Image
                      src={url}
                      alt={name}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  {type.includes("audio") && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <audio controls>
                        <source src={url} type={type} />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {type.includes("video") && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <video controls className="w-full aspect-video">
                        <source src={url} type={type} />
                        Your browser does not support the audio element.
                      </video>
                    </div>
                  )}
                  {type.includes("application/pdf") && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <iframe className="w-3/4 aspect-[16/9]" src={url} />
                    </div>
                  )}
                </div>
                <div className="absolute top-0 w-full left-0 z-[62] bg-gradient-to-b from-black to-transparent opacity-50 h-48"></div>
                <div className="absolute top-0 w-full inline-flex items-center justify-between left-0 z-[62]  p-6">
                  <div className="inline-flex items-center grow">
                    <button
                      onClick={onClose}
                      className="justify-center w-10 h-10 px-0 py-0 mt-1 mr-3 rounded-full btn-gray"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-extrabold text-white font-marianne"
                      >
                        {name}
                      </Dialog.Title>
                      <div className="">
                        <p className="text-gray-200 text-md font-spectral">
                          mis à jour{" "}
                          {formatRelative(new Date(updatedAt), new Date(), {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={download}
                    className="justify-center w-10 h-10 px-0 py-0 mt-1 rounded-full btn-gray"
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
