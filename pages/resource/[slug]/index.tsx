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
} from "@heroicons/react/outline";
import {
  HandIcon,
  HeartIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ChipList } from "@components/ui/ChipList";
import { fetchRSR } from "@utils/fetchRSR";
import { useAuth } from "@hooks/useAuth";
import { UserMinimum } from "@definitions/User";
import { Comment } from "@definitions/Resource/Comment";
import { Tab } from "@headlessui/react";
import { classes } from "@utils/classes";
import { format, formatDistance } from "date-fns";
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
  createdAt,
  validated,
  visibility,
}: Resource) => {
  const [message, setMessage] = useState<string>("");
  const [newLikes, setNewLikes] = useState<UserMinimum[]>(likes || []);
  const [newComments, setNewComments] = useState<Comment[]>(comments || []);

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
          <div className="flex flex-col space-y-3 lg:divide-x font-spectral lg:h-10 lg:items-center lg:flex-row lg:space-x-2 lg:space-y-0">
            <div className="flex items-center text-sm text-gray-500 transition duration-200 border-gray-400 hover:text-gray-700 dark:text-gray-400">
              <Link href="/resource">
                <a className="inline-flex btn-text-gray">
                  <ChevronLeftIcon className="w-5 h-5 mr-1" />
                  Retour
                </a>
              </Link>
            </div>
            <div className="flex items-center text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
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
            <div className="items-center hidden pl-1 text-xs text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
              {validated ? "Validé" : "En attente de validation"}
            </div>
          </div>

          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="mb-2 text-3xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              {data.attributes.properties.name}
            </h2>
            <div className="flex mt-2 space-x-3 lg:mt-0 lg:ml-4">
              {!newLikes.find((l) => l.uid === user?.data.uid) ? (
                <button className="btn-red" key="likeBtn" onClick={like}>
                  <HeartIconOutline className="w-4 h-4 mr-1 select-none shrink-0" />
                  {"J'aime"}
                </button>
              ) : (
                <button className="btn-red" key="dislikeBtn" onClick={like}>
                  <HeartIcon className="w-4 h-4 mr-1 select-none shrink-0" />
                  {"Je n'aime plus"}
                </button>
              )}
              {user?.data && (
                <button onClick={report} className="btn-yellow">
                  <ExclamationIcon className="w-4 h-4 mr-1 select-none shrink-0" />
                  Signaler
                </button>
              )}
              {owner.uid === user?.data.uid && (
                <Link href={"/resource/" + slug + "/edit"}>
                  <a className="btn-gray">
                    <PencilIcon className="w-4 h-4 mr-1 select-none shrink-0" />
                    <span>Éditer</span>
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
              list={tags.map((tag: string) => ({ label: tag, value: tag }))}
            />
          </div>
        </div>
        <div className="flex flex-col w-full px-6 pt-3 pb-8 space-y-6 grow lg:px-24">
          <Tab.Group>
            <Tab.List className="flex lg:flex-row p-2 space-y-1.5 flex-col lg:space-y-0 lg:space-x-3 bg-white dark:bg-black rounded-xl">
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
            <Tab.Panels className="p-2 bg-white dark:bg-black rounded-xl focus:outline-none">
              <Tab.Panel className="min-h-[24rem] h-full">
                <ResourceView {...data} slug={slug} />
              </Tab.Panel>
              <Tab.Panel className="min-h-[24rem] h-full flex flex-col justify-between ">
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
  const res = await fetch(
    "http://localhost:3000/api/resource/" + context.params.slug
  );
  const body = await res.json();

  const resource: Resource[] = body?.data?.attributes;

  return {
    props: { ...resource },
  };
};

interface ResourceViewProps {
  type: Resource["data"]["type"];
  attributes: Resource["data"]["attributes"];
  slug: Resource["slug"];
}

interface LocationViewProps {
  attributes: GeoJSON_Point;
  slug: string;
}
interface ExternalLinkViewProps {
  attributes: ExternalLink;
  slug: string;
}
interface PhysicalItemViewProps {
  attributes: PhysicalItem;
  slug: string;
}

interface EventViewProps {
  attributes: Event;
  slug: string;
}

interface CommentViewProps {
  comment: Comment;
  slug: string;
}

const ResourceView = ({ type, attributes, slug }: ResourceViewProps) => {
  return (
    <div className="grid h-full gap-6 min-h-max xl:grid-cols-3 md:grid-cols-2">
      {type === "location" && (
        <LocationView attributes={attributes} slug={slug} />
      )}
      {type === "physical_item" && (
        <PhysicalItemView attributes={attributes} slug={slug} />
      )}
      {type === "external_link" && (
        <ExternalLinkView attributes={attributes} slug={slug} />
      )}
      {type === "event" && <EventView attributes={attributes} slug={slug} />}
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

const ExternalLinkView = ({ attributes, slug }: ExternalLinkViewProps) => {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.image ? (
          <img
            src={attributes.properties.image.url}
            alt={attributes.properties.name}
            className="h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-amber-800 bg-amber-200 dark:text-amber-200 dark:bg-amber-800">
            <LinkIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Lien externe</p>
            {!attributes.properties.image && (
              <p className="pt-2 mx-12 mt-2 text-sm text-center border-t border-amber-500 text-amber-600 dark:text-amber-400 font-spectral">
                {"Aucune image n'est disponible pour cette ressource"}
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

const PhysicalItemView = ({ attributes, slug }: PhysicalItemViewProps) => {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.image ? (
          <img
            src={attributes.properties.image.url}
            alt={attributes.properties.name}
            className="h-full"
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

const EventView = ({ attributes, slug }: EventViewProps) => {
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
        {attributes.properties.image ? (
          <img
            src={attributes.properties.image.url}
            alt={attributes.properties.name}
            className="h-48"
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

const CommentView = ({ comment, slug }: CommentViewProps) => {
  const { owner, content, createdAt } = comment;
  const { user } = useAuth();
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
            // todo
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
