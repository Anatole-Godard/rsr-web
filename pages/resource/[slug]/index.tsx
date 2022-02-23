/* eslint-disable @next/next/no-img-element */
import { AppLayout } from "@components/layouts/AppLayout";
import { Resource } from "@definitions/Resource";
import {
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  ExclamationIcon,
  HeartIcon as HeartIconOutline,
  LinkIcon,
  PaperAirplaneIcon,
  PencilIcon,
  ShareIcon,
  ThumbUpIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import {
  ExternalLinkIcon,
  HandIcon,
  HeartIcon,
  LocationMarkerIcon,
  ExclamationIcon
} from "@heroicons/react/solid";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Chip } from "@components/ui/Chip";
import { ChipList } from "@components/ui/ChipList";
import { fetchRSR } from "@utils/fetchRSR";
import { useAuth } from "@hooks/useAuth";
import { UserMinimum } from "@definitions/User";
import { Comment } from "@definitions/Resource/Comment";
import { Tab } from "@headlessui/react";
import { classes } from "@utils/classes";
import { format, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { types } from "constants/resourcesTypes";
import { AvatarGroup } from "@components/ui/AvatarGroup";
import { GeoJSON_Point } from "@definitions/Resource/GeoJSON";
import { ExternalLink } from "@definitions/Resource/ExternalLink";
import { PhysicalItem } from "@definitions/Resource/PhysicalItem";
import Image from "next/image";

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
      body: JSON.stringify({ type: 'resource', 'documentUid': slug, context: slug }),
    })
    if (res.ok) {
      const body = await res.json();
      console.log(body)
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
      <section className="flex flex-col w-full h-full bg-gray-100 dark:bg-gray-900">
        {/* 2xl:sticky 2xl:top-0 z-[47] */}
        <div className="flex flex-col w-full px-6 py-6 bg-white border-b border-gray-200 lg:px-32 xl:px-48 dark:bg-black dark:border-gray-800">
          <div className="flex flex-col font-spectral lg:h-10 lg:items-center lg:flex-row lg:space-x-3">
            <div className="flex items-center text-sm text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
              {types
                .find((t) => t.value === data?.type)
                ?.icon.outline({ className: "w-5 h-5 mr-1 shrink-0" })}
              {types.find((t) => t.value === data?.type)?.label}
            </div>

            <div className="items-center hidden text-sm text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
              <CalendarIcon className="w-5 h-5 mr-1 shrink-0" />
              {formatDistance(new Date(createdAt), new Date(), {
                addSuffix: true,
                locale: fr,
              })}
            </div>
            {newLikes.length >= 1 ? (
              <div className="items-center hidden text-sm text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
                <AvatarGroup users={newLikes} limit={5} />
                <UsersIcon className="hidden lg:flex items-center fas fa-users flex-shrink-0 mx-1.5 h-5 w-5 " />
                {newLikes?.length || 0}{" "}
                {newLikes?.length > 1 ? "personnes aiment" : "personne aime"}
              </div>
            ) : (
              <div className="items-center hidden text-sm text-gray-500 transition duration-200 lg:inline-flex hover:text-gray-700 dark:text-gray-400">
                <UsersIcon className="hidden lg:flex items-center fas fa-users flex-shrink-0 mx-1.5 h-5 w-5 " />

                {"Personne n'aime pour l'instant"}
              </div>
            )}
          </div>

          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="mb-2 text-3xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              {data.attributes.properties.name}
            </h2>
            <div className="flex mt-2 space-x-3 lg:mt-0 lg:ml-4">
              {!newLikes.find((l) => l.uid === user?.data.uid) ? (
                <button className="btn-text-red" onClick={like}>
                  <HeartIconOutline className="w-4 h-4 mr-1 select-none shrink-0" />
                  {"J'aime"}
                </button>
              ) : (
                <button className="btn-red" onClick={like}>
                  <HeartIcon className="w-4 h-4 mr-1 select-none shrink-0" />
                  {"Je n'aime plus"}
                </button>
              )}
              {user?.data && (
                <button
                    onClick={()=>report()}
                    className="px-2 text-gray-700 bg-gray-100 btn-yellow"
                >
                  <ExclamationIcon className="w-4 h-4" />
                </button>
            )}
              {owner.uid === user?.data.uid && (
                <Link href={"/resource/" + slug}>
                  <a className="btn-gray">
                    <PencilIcon className="w-4 h-4 mr-1 select-none shrink-0" />
                    Éditer
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="w-full pt-2 pb-2 text-sm prose text-justify text-gray-500 font-spectral dark:text-gray-400">
            {description}
          </div>
          <div className="inline-flex pt-3 -ml-2 overflow-x-hidden md:pt-0">
            <ChipList
              color="blue"
              size="normal"
              list={tags.map((tag: string) => ({ label: tag, value: tag }))}
            />
          </div>
        </div>
        <div className="flex flex-col w-full px-6 pt-3 pb-8 space-y-6 lg:px-32 xl:px-48">
          <Tab.Group>
            <Tab.List className="flex lg:flex-row p-2 space-y-1.5 flex-col lg:space-y-0 lg:space-x-3 bg-white dark:bg-black rounded-xl">
              <Tab
                className={({ selected }) =>
                  classes(
                    "w-full py-2.5 text-sm leading-5 font-medium select-none font-spectral focus:outline-none duration-300 rounded-md hover:bg-blue-500 hover:text-white",
                    selected
                      ? "bg-blue-300 text-blue-700 dark:bg-blue-700 dark:text-blue-300"
                      : "text-gray-500"
                  )
                }
              >
                Aperçu
              </Tab>
              <Tab
                className={({ selected }) =>
                  classes(
                    "w-full py-2.5 text-sm leading-5 font-medium select-none font-spectral focus:outline-none duration-300 rounded-md hover:bg-blue-500 hover:text-white",
                    selected
                      ? "bg-blue-300 text-blue-700 dark:bg-blue-700 dark:text-blue-300"
                      : "text-gray-500"
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
                  <ul className="relative h-full mx-4 my-2 overflow-x-visible overflow-y-scroll border-l border-gray-200 max-h-96 grow dark:border-gray-700">
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
                  <button type="submit" className="ml-2 btn-blue shrink-0">
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
    </div>
  );
};

const LocationView = ({ attributes, slug }: LocationViewProps) => {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        <Map point={attributes.geometry.coordinates} className="h-full" />
      </div>
      <div className="pt-6 flex-flex-col">
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
          <div className="flex flex-col items-center justify-center h-full text-emerald-800 bg-emerald-200 dark:text-emerald-200 dark:bg-emerald-800">
            <LinkIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Lien externe</p>
          </div>
        )}
      </div>
      <div className="">
        <div className="pt-6 flex-flex-col">
          <h4 className="mb-3 text-3xl font-bold font-marianne">
            Lien hypertexte
          </h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            {attributes.properties.url}
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
          </div>
        )}
      </div>
      <div className="">
        <div className="pt-6 flex-flex-col">
          <h4 className="mb-3 text-3xl font-bold font-marianne">Catégorie</h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            {attributes.properties.category}
          </div>
        </div>
        <div className="pt-6 flex-flex-col">
          <h4 className="mb-3 text-3xl font-bold font-marianne">Prix</h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            {attributes.properties.price}
          </div>
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
      <span className="absolute flex items-center justify-center w-[2.25rem] h-[2.25rem] bg-blue-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-blue-900">
        <Image
          className="rounded-full"
          src={owner.photoURL || "/uploads/user/default.png"}
          alt={owner.fullName}
          layout="fill"
        />
      </span>
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-2 pr-4 text-sm bg-white border border-gray-200 rounded-lg shadow-sm font-spectral dark:bg-gray-700 dark:border-gray-600">
          {content}
        </div>
        <div className="inline-flex items-center mt-1 ml-1 space-x-1">
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
