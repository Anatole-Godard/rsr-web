import { AppLayout } from "@components/Layout/AppLayout";
import { Resource } from "@definitions/Resource";
import { Dialog, Tab, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronLeftIcon,
  CloudUploadIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { fetchXHR } from "libs/fetchXHR";
import { classes } from "libs/classes";
import { types, visibilities } from "constants/resourcesTypes";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { fetchRSR } from "libs/fetchRSR";
import { useAuth } from "@hooks/useAuth";
import { UserMinimum } from "@definitions/User";
import { TrashIcon } from "@heroicons/react/outline";
import useFetchRSR from "@hooks/useFetchRSR";
import { TagDocument } from "@definitions/Resource/Tag";
import {isAdmin} from "@utils/getCurrentUser";
import { MediaUploader } from "@components/Resource/Helper/Media/Uploader";
import { Input, WrapperModularInputs } from "@components/Resource/Helper/ModularInput";
import { toModularInput } from "@utils/toModularInput";
import { Media } from "@definitions/Resource/Media";
import toast from "react-hot-toast";

const Map: any = dynamic(() => import("@components/Map/Map") as any, {
  ssr: false,
});

const Select: any = dynamic(() => import("react-select/creatable") as any, {
  ssr: false,
});

interface Props extends Resource {
  membersOptions: UserMinimum[];
}

const ResourceEdit: NextPage<any> = (props: Props) => {
  const router = useRouter();
  const { user } = useAuth();

  const [pictureUrl, setPictureUrl] = useState(
    props.data?.attributes.properties?.image?.url || null
  );
  const [pictureFile, setPictureFile] = useState(null);
  const [name, setName] = useState<string>(
    props.data?.attributes.properties.name
  );
  const [description, setDescription] = useState<string | null>(
    props.data?.attributes.properties.description || props.description
  );
  const [tags, setTags] = useState<{ label: string; value: string }[]>(
    props.tags?.map((tag) => ({ label: tag.name, value: tag.name }))
  );
  const [tagInputValue, setTagInputValue] = useState<string>("");

  const [type, setType] = useState(
    types.find((t) => t.value === props.data?.type) || types[0]
  );

  const [visibility, setVisibility] = useState(
    visibilities.find((v) => v.value === props.visibility) || visibilities[0]
  );
  const [members, setMembers] = useState<UserMinimum[]>(props.members || []);

  const [position, setPosition] = useState(
    props.data?.attributes.geometry?.coordinates || [0, 0]
  );
  const [location, setLocation] = useState(
    props.data?.attributes.properties?.location || ""
  );

  const [price, setPrice] = useState<string | null>(
    props.data?.attributes.properties.price || null
  );
  const [category, setCategory] = useState<string | null>(
    props.data?.attributes.properties.category || null
  );

  const [externalLink, setExternalLink] = useState<string | null>(
    props.data?.attributes.properties.url || null
  );

  const [startDate, setStartDate] = useState<string | null>(
    props.data?.attributes.properties.startDate || null
  );
  const [endDate, setEndDate] = useState<string | null>(
    props.data?.attributes.properties.endDate || null
  );

  const [medias, setMedias] = useState<Media[]>(
    // props.data?.attributes.properties.medias || []
    []
  );
  const [inputs, setInputs] = useState<Input[]>(
    toModularInput(props.data?.attributes.properties) || []
  );

  const [validForm, setValidForm] = useState<boolean>(false);
  const [requestOk, setRequestOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const deleteResource = async () => {
    const res = await fetchRSR(
      `/api/resource/${props.slug}/delete`,
      user?.session,
      {
        method: "DELETE",
      }
    );
    if (res.ok) router.push("/resource");
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const response = await fetchXHR(
        "GET",
        `https://api-adresse.data.gouv.fr/reverse/?lat=${position.lat}&lon=${position.lng}`
      );
      //   const body = await response.json();
      let json = JSON.parse(response as string);
      if (json?.features[0] != null) {
        setLocation(json.features[0]?.properties?.label);
      } else {
        setLocation("");
      }
    };
    if (position && position.lat != null && position.lng != null)
      fetchLocation();
  }, [position]);

  const formatResource = (): Resource => {
    let data: Resource["data"] = {
      type: type.value as Resource["data"]["type"],
      attributes: {},
    };
    if (type.value === "physical_item") {
      data.attributes = {
        properties: {
          name,
          description,
          price,
          category,
          photoURL: null,
        },
      };
    } else if (type.value === "location") {
      data.attributes = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [position.lat, position.lng],
        },
        properties: {
          name,
          location,
        },
      };
    } else if (type.value === "external_link") {
      data.attributes = {
        properties: {
          name,
          description,
          url: externalLink,
        },
      };
    } else if (type.value === "event") {
      data.attributes = {
        properties: {
          name,
          description,
          startDate,
          endDate,
          participants: [],
        },
      };
    } else if (type.value === "other") {
      data.attributes = {
        properties: {
          name,
          description,
        },
      };
      inputs.map((input) => {
        data.attributes.properties[input.slug] = input;
      });
    }

    // resetting to default data.attributes.properties.medias
    if (type.hasMedia) data.attributes.properties.medias = [];

    return {
      description,
      tags: tags.map((tag) => tag.value),
      data,
      visibility: (
        visibility as unknown as {
          value: "public" | "private" | "unlisted";
        }
      ).value,
      members,
    } as Resource;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validForm) {
      setLoading(true);
      try {
        const response = await fetchRSR(
          `/api/resource/${props.slug}/edit`,
          user?.session,
          {
            method: "PUT",
            body: JSON.stringify(formatResource()),
          }
        );

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
              await fetch(`/api/resource/${body.data.attributes.slug}/upload`, {
                method: "POST",
                body: formData,
              })
            );
          }
          if (responses.every((r) => r.ok)) {
            setRequestOk(true);
            toast.success("Ressource éditée avec succès");
            
            router.push(`/resource/${body.data.attributes.slug}`);
          } else setRequestOk(false);
        } else if (response.ok && medias.length === 0) {
          setRequestOk(true);
          toast.success("Ressource éditée avec succès");
          router.push(`/resource/${body.data.attributes.slug}`);
        }
      } catch (err) {
        console.log(err);
        toast.error("Une erreur est survenue");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    // Form Verifications
    switch (type.value) {
      case "physical_item":
        if (name && description && category) {
          setValidForm(true);
        }
        break;

      case "location":
        if (name && description && position && location) {
          setValidForm(true);
        }
        break;

      case "external_link":
        if (name && description && externalLink) {
          setValidForm(true);
        }
        break;

      case "event":
        if (name && description && startDate) setValidForm(true);
        break;

      case "other":
        if (name && description) setValidForm(true);
        break;

      default:
        setValidForm(false);
        break;
    }
  }, [
    name,
    description,
    tags,
    type,
    position,
    price,
    externalLink,
    category,
    location,
    startDate,
    inputs,
    medias,
  ]);

  const {
    data: tagsOptions,
  }: {
    data?: TagDocument[];
  } = useFetchRSR("/api/resource/tags", user?.session);

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
                <Image
                  src="/img/pencil.png"
                  width={64}
                  height={64}
                  alt="Pencil"
                />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                Éditer
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  {name || "cette ressource"}
                </span>
              </h3>
            </div>
            <div className="inline-flex items-center space-x-2">
              <Link href={`/resource/${props.slug}`}>
                <a className="btn-gray">
                  <ChevronLeftIcon className="w-4 h-4 mr-2" /> Retour
                </a>
              </Link>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="btn-red"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Supprimer
              </button>
              <button
                type="submit"
                className={classes(
                  requestOk ? "btn-green" : validForm ? "btn-amber" : "btn-red",
                  "group"
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
                    <CloudUploadIcon className="w-4 h-4 mr-1 duration-300 text-amber-700 group-active:text-white" />
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
        </div>
        <div className="flex flex-col flex-grow px-4 py-3 pb-6 bg-gray-100 rounded-tl-xl md:flex-row">
          <div className="flex flex-col w-full px-2 space-y-3 md:w-1/2">
            <label>
              <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                Titre de la ressource
              </h4>
              <input
                type="text"
                className="bg-gray-200 input"
                placeholder="Titre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </label>
            <label className="flex flex-col grow">
              <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                Description de la ressource
              </h4>
              <textarea
                className="bg-gray-200 input grow"
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                value={description}
                placeholder="Description"
              ></textarea>
            </label>

            <label>
              <h4 className="-mb-2 text-sm after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-gray-700 font-marianne">
                Visibilité de la ressource
              </h4>
            </label>

            <Tab.Group
              selectedIndex={visibilities.findIndex(
                (v) => v.value === visibility.value
              )}
              onChange={(selected) => {
                setRequestOk(null);
                setVisibility(visibilities[selected]);
                if (visibilities[selected].value !== "unlisted") setMembers([]);
                else setMembers(props.members);
              }}
            >
              <div className="inline-flex items-center w-full">
                <Tab.List className="flex space-x-2 bg-gray-100 grow rounded-xl">
                  {visibilities.map((v, i) => (
                    <Tab
                      key={v.value}
                      className={({ selected }) =>
                        classes(
                          "w-full py-2.5 text-xs leading-5 font-medium rounded-md",
                          "focus:outline-none transition-all duration-300 focus:ring-2 ring-offset-2 ring-amber-500 truncate inline-flex items-center justify-center",
                          selected
                            ? "bg-amber-700  text-amber-100 font-semibold shadow"
                            : "text-amber-700 bg-amber-100 hover:bg-amber-300 hover:text-amber-800",
                          i === 0 ? "rounded-l-lg" : "",
                          i === visibilities.length - 1 ? "rounded-r-lg" : ""
                        )
                      }
                    >
                      {v.icon.outline({ className: "w-4 h-4 mr-1 shrink-0" })}

                      {v.label}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </Tab.Group>
            {visibility.value === "unlisted" && (
              <label>
                <h4 className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne">
                  Membres
                </h4>
                <Select
                  name="members"
                  className="w-full"
                  menuPlacement="auto"
                  isMulti
                  placeholder={
                    <div className="text-sm font-semibold font-spectral">
                      Qui souhaitez-vous inviter ?
                    </div>
                  }
                  options={props.membersOptions
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
                      <span className="text-xs font-marianne">
                        {member.label}
                      </span>
                    </div>
                  )}
                  onChange={(value) =>
                    setMembers(
                      value.map((v) => ({
                        uid: v.value,
                        fullName: v.label,
                        photoURL: v.photoURL,
                      }))
                    )
                  }
                  value={members.map((m) => ({
                    value: m.uid,
                    label: m.fullName,
                    photoURL: m.photoURL,
                  }))}
                />
              </label>
            )}

            <label>
              <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                Étiquettes
              </h4>
              <Select
                name="tags"
                className="w-full"
                isClearable
                isMulti
                menuPlacement="auto"
                options={tagsOptions
                  ?.filter(
                    (tag: TagDocument) =>
                      !tags.includes({ value: tag.name, label: tag.name })
                  )
                  .map((tag: TagDocument) => ({
                    label: tag.name,
                    value: tag.name,
                  }))}
                value={tags}
                inputValue={tagInputValue}
                onInputChange={(e: string) => setTagInputValue(e)}
                onChange={(e: any[]) => setTags(e)}
                placeholder={
                  <div className="text-sm font-semibold font-spectral">
                    Utilisez des étiquettes pour mieux identifier la ressource
                  </div>
                }
                formatOptionLabel={(tag: { label: string; value: string }) => (
                  <div className="inline-flex items-center">
                    <span className="text-xs font-spectral">{tag.label}</span>
                  </div>
                )}
                onKeyDown={(event: {
                  key: any;
                  preventDefault: () => void;
                }) => {
                  if (!tagInputValue) {
                    return;
                  }
                  switch (event.key) {
                    case "Enter":
                    case "Tab":
                      setTags([
                        ...tags,
                        { value: tagInputValue, label: tagInputValue },
                      ]);
                      setTagInputValue("");
                      console.group("Value Added");
                      console.log(tags);
                      console.groupEnd();
                      event.preventDefault();
                  }
                }}
              />
            </label>
          </div>
          <div className="flex flex-col justify-between w-full px-2 mt-3 space-y-3 md:w-1/2 md:mt-0">
            <div className="flex flex-col w-full h-full space-y-3">
              <label>
                <h4 className="-mb-2 text-sm font-semibold text-gray-700 font-marianne">
                  Type de la ressource
                </h4>
              </label>

              <Tab.Group
                defaultIndex={types.indexOf(type)}
                onChange={(selected) => {
                  setRequestOk(null);
                  setType(types[selected]);
                }}
              >
                <div className="inline-flex items-center w-full">
                  <Tab.List className="flex space-x-2 bg-gray-100 grow rounded-xl">
                    {types.map((type, i) => (
                      <Tab
                        key={type.value}
                        className={({ selected }) =>
                          classes(
                            "w-full py-2.5 text-xs leading-5 font-medium rounded-md",
                            "focus:outline-none transition-all duration-300 focus:ring-2 ring-offset-2 ring-amber-500 truncate inline-flex items-center justify-center",
                            selected
                              ? "bg-amber-700  text-amber-100 font-semibold shadow"
                              : "text-amber-700 bg-amber-100 hover:bg-amber-300 hover:text-amber-800",
                            i === 0 ? "rounded-l-lg" : "",
                            i === types.length - 1 ? "rounded-r-lg" : ""
                          )
                        }
                      >
                        {type.icon.outline({
                          className: "w-4 h-4 mr-1 shrink-0",
                        })}

                        {type.label}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
              </Tab.Group>

              {types.find((t) => t.value === type.value).hasMedia && (
                <div className="flex flex-col h-full overflow-hidden grow">
                  <h4
                    className={classes(
                      "mb-1 text-sm font-semibold text-gray-700 font-marianne",
                      type.value === "physical_item"
                        ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                        : ""
                    )}
                  >
                    Médias
                  </h4>

                  <MediaUploader files={medias} setFiles={setMedias} />
                </div>
              )}
              {type.value === "physical_item" && (
                <>
                  <label>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                      Prix
                    </h4>
                    <input
                      type="number"
                      className="bg-gray-200 input"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </label>
                  <label>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                      Catégorie
                    </h4>
                    <input
                      type="text"
                      className="bg-gray-200 input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </label>
                </>
              )}

              {type.value === "external_link" && (
                <>
                  <label>
                    <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                      Lien externe
                    </h4>
                    <input
                      type="text"
                      className="bg-gray-200 input"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                    />
                  </label>
                </>
              )}

              {type.value === "location" && (
                <label className="flex flex-col grow">
                  <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                    Emplacement de la ressource
                  </h4>
                  <div className="w-full mb-3">
                    <input
                      type="text"
                      value={location}
                      className="bg-gray-200 input"
                      placeholder="Emplacement"
                      onChange={(e) => setLocation(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex-grow rounded-lg">
                    <Map
                      className="relative inset-0 w-full h-64 rounded-lg md:h-full"
                      center={[46.227638, 2.213749]}
                      zoom="4.5"
                      onClick={(e) => setPosition(e.latlng)}
                      point={position as number[]}
                    ></Map>
                  </div>
                </label>
              )}

              {type.value === "event" && (
                <>
                  <div className="flex flex-col">
                    <h4
                      className={classes(
                        "mb-1 text-sm font-semibold text-gray-700 font-marianne"
                      )}
                    >
                      Dates et heures
                    </h4>

                    <div className="grid gap-2 xl:grid-cols-2">
                      <label className="flex flex-col">
                        <p className="after:content-['*'] text-gray-500 after:ml-0.5 after:text-red-500 text-xs font-spectral">
                          Date et heure de début
                        </p>
                        <input
                          placeholder="Date et heure de début"
                          className="bg-gray-200 input "
                          type="datetime-local"
                          onChange={(e) => setStartDate(e.target.value)}
                          value={startDate}
                        />
                      </label>
                      <label className="flex flex-col">
                        <p className="text-xs text-gray-500 font-spectral">
                          Date et heure de fin
                        </p>
                        <input
                          placeholder="Date et heure de fin"
                          className="bg-gray-200 input "
                          type="datetime-local"
                          onChange={(e) => setEndDate(e.target.value)}
                          value={endDate}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {type.value === "other" && (
                <WrapperModularInputs data={inputs} setData={setInputs} />
              )}
            </div>
          </div>
        </div>
      </form>
      <Transition appear show={deleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setDeleteModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 font-marianne"
                >
                  Supprimer #{props.slug}
                </Dialog.Title>
                <div className="mt-6">
                  <p className="text-sm text-gray-500 font-spectral">
                    Voulez-vous vraiment supprimer cette ressource ? Cette
                    action est <strong>irréversible</strong>.
                    <br />
                    {`Les commentaires et les "J'aime" associés seront également supprimés.`}
                  </p>
                </div>

                <div className="inline-flex items-center justify-end w-full mt-4 space-x-3">
                  <button
                    type="button"
                    className="btn-red"
                    onClick={deleteResource}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Supprimer
                  </button>
                  <button
                    type="button"
                    className="btn-gray"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Fermer
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

export default ResourceEdit;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user },
  } = context.req;
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }
  try {
    let parsedUser = JSON.parse(user);
    const res = await fetchRSR(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      }/resource/${context.params.slug}`,
      parsedUser.session
    );
    const body = await res.json();
    const resource: Resource = body?.data?.attributes;

    if (!resource) {
      return {
        redirect: {
          permanent: false,
          destination: "/resource",
        },
      };
    }

    if (!(await isAdmin({headers: parsedUser.session})))
      if( resource.owner.uid !== parsedUser?.data.uid){
        return {
          redirect: {
            permanent: false,
            destination: "/resource",
          },
        };
      }


    const users = await (await fetch("http://localhost:3000/api/user")).json();

    return {
      props: { ...resource, membersOptions: users.data.attributes },
    };
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: "/resource",
      },
    };
  }
};
