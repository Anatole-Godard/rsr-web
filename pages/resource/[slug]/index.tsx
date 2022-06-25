/* eslint-disable @next/next/no-img-element */
import { AppLayout } from "@components/Layout/AppLayout";
import { Resource } from "@definitions/Resource";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ExclamationIcon,
  HeartIcon as HeartIconOutline,
  PencilIcon,
  UsersIcon,
  EyeIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { GetServerSideProps, NextPage } from "next";
import { FormEvent, useState } from "react";

import Link from "next/link";
import { ChipList } from "@components/UI/Chip/ChipList";
import { fetchRSR } from "libs/fetchRSR";
import { useAuth } from "@hooks/useAuth";
import { UserMinimum } from "@definitions/User";
import { Comment } from "@definitions/Resource/Comment";
import { Tab } from "@headlessui/react";
import { classes } from "libs/classes";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { types, visibilities } from "constants/resourcesTypes";
import { AvatarGroup } from "@components/UI/Avatar/Group";
import "react-nice-dates/build/style.css";
import { ShowMoreText } from "@components/UI/ShowMore";
import { PlaylistDropdown } from "@components/Dropdown/PlaylistDropdown";
import { TagDocument } from "@definitions/Resource/Tag";
import { CommentView } from "@components/Resource/CommentView";
import { ResourceView } from "@components/Resource/ResourceView";
import toast from "react-hot-toast";

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

  const { user } = useAuth();
  const report = async () => {
    const toastID = toast.loading("Signalement en cours...");
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
    toast.dismiss(toastID);
    if (res.ok) {
      toast.success("Signalement envoyé");
      const body = await res.json();
      console.log(body);
    } else {
      toast.error("Une erreur est survenue");
    }
  };

  const like = async () => {
    const toastID = toast.loading("Ajout du like en cours...");
    const res = await fetchRSR(`/api/resource/${slug}/like`, user?.session);
    toast.dismiss(toastID);
    if (res.ok) {
      const body = await res.json();
      setNewLikes(body?.data.attributes.likes);
      toast.success(
        body?.data.attributes.likes.findIndex(
          (l: UserMinimum) => l.uid === user?.data.uid
        ) !== -1
          ? "Like ajouté"
          : "Like supprimé"
      );
    } else {
      toast.error("Une erreur est survenue");
    }
  };

  const comment = async (e: FormEvent) => {
    e.preventDefault();
    const toastID = toast.loading("Ajout du commentaire en cours...");
    const res = await fetchRSR(`/api/resource/${slug}/comment`, user?.session, {
      method: "POST",
      body: JSON.stringify({
        commentContent: message,
      }),
    });
    toast.dismiss(toastID);
    if (res.ok) {
      toast.success("Commentaire ajouté");
      const body = await res.json();
      setNewComments(body?.data.attributes.comments);
      setMessage("");
    } else {
      toast.error("Une erreur est survenue");
    }
  };

  // @ts-ignore
  return (
    <AppLayout>
      <section className="flex flex-col w-full bg-gray-100 h-fit dark:bg-gray-900">
        {/* 2xl:sticky 2xl:top-0 z-[47] */}
        <div className="flex flex-col w-full px-6 py-6 bg-white border-b border-gray-200 lg:px-24 dark:bg-black dark:border-gray-800">
          <Link href="/resource">
            <a className="hidden mb-1 text-xs btn-gray w-max lg:flex">
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

            <div className="inline-flex items-center text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 mx-1 shrink-0" />
              {formatDistance(new Date(createdAt), new Date(), {
                addSuffix: true,
                locale: fr,
              })}
            </div>
            {newLikes.length >= 1 ? (
              <div className="inline-flex items-center text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
                <span className="xl:ml-1">
                  <AvatarGroup users={newLikes} limit={5} />
                </span>
                <UsersIcon className="hidden lg:flex items-center shrink-0 ml-1.5 h-4 w-4 " />
                <span className="ml-1.5">
                  {newLikes?.length || 0}{" "}
                  {newLikes?.length > 1 ? "personnes aiment" : "personne aime"}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
                <UsersIcon className="flex items-center shrink-0 ml-1 mr-1.5 h-4 w-4 " />

                {"Personne n'aime pour l'instant"}
              </div>
            )}
            <div className="inline-flex items-center text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
              {visibilities
                .find((v) => v.value === visibility)
                ?.icon.outline({ className: "w-4 h-4 mx-1 shrink-0" })}
              {visibilities.find((v) => v.value === visibility)?.label}
            </div>
            {user?.data.uid === owner.uid && !validated && (
              <div className="inline-flex items-center pl-1 text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
                En attente de validation
              </div>
            )}
            {seenBy.length >= 1 ? (
              <div className="inline-flex items-center text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
                <EyeIcon className="flex items-center shrink-0 ml-1 mr-1.5 h-4 w-4 " />
                {seenBy?.length || 0} {seenBy?.length > 1 ? "vues" : "vue"}
              </div>
            ) : (
              <div className="inline-flex items-center text-xs text-gray-500 transition duration-200 hover:text-gray-700 dark:text-gray-400">
                <EyeIcon className="flex items-center shrink-0 ml-1 mr-1.5 h-4 w-4 " />

                {"Personne n'a vu pour l'instant"}
              </div>
            )}
          </div>

          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="mb-2 text-3xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              {data.attributes.properties.name}
            </h2>
            <div className="flex mt-2 space-x-3 lg:mt-0 lg:ml-4">
              <Link href="/resource">
                <a className="flex text-xs btn-gray lg:hidden">
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  Retour
                </a>
              </Link>

              {user?.data ? (
                <>
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
              ) : (
                <Link href="/auth/login" key="login">
                  <a className="btn-bleuFrance">
                    <UserIcon className="w-4 h-4 select-none md:mr-2 shrink-0" />
                    Se connecter
                  </a>
                </Link>
              )}
              {owner.uid === user?.data.uid && (
                <Link href={"/resource/" + slug + "/edit"} key="edit">
                  <a className="btn-gray">
                    <PencilIcon className="w-4 h-4 select-none md:mr-1 shrink-0" />
                    <span className="hidden md:flex">Éditer</span>
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="inline-flex items-center justify-between w-full my-2 ">
            <ShowMoreText
              /* Default options */
              lines={3}
              more="Voir plus"
              less="Voir moins"
              className="w-full text-sm prose text-justify text-gray-500 grow font-spectral dark:text-gray-400"
              anchorClass="text-bleuFrance-500 dark:text-bleuFrance-300 underline"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {description}
            </ShowMoreText>
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
                ...(user?.data.uid === owner.uid
                  ? { validated: tag.validated }
                  : null),
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
              <Tab.Panel className=" min-h-[24rem] h-full">
                <ResourceView {...data} slug={slug} updatedAt={updatedAt} />
              </Tab.Panel>
              <Tab.Panel className="max-h-[24rem] min-h-[24rem] h-full flex flex-col justify-between ">
                {newComments.length > 0 ? (
                  <ul className="relative h-full mx-2 my-2 overflow-x-hidden overflow-y-scroll max-h-96 grow dark:border-gray-700">
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
                {user?.data.uid && (
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
                )}
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
