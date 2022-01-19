import { AppLayout } from "@components/layouts/AppLayout";
import { Resource } from "@definitions/Resource/Resource";
import { Tab } from "@headlessui/react";
import {
  CheckIcon,
  ChevronLeftIcon,
  CloudUploadIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { makeRequest } from "@utils/asyncXHR";
import { classes } from "@utils/classes";
import { types } from "constants/resourcesTypes";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Map: any = dynamic(() => import("@components/map/Map") as any, {
  ssr: false,
});

const Select: any = dynamic(() => import("react-select/creatable") as any, {
  ssr: false,
});


const ResourceEdit: NextPage<any> = (props: Resource) => {
  const router = useRouter();

  const [pictureUrl, setPictureUrl] = useState(
    props.data.attributes.pictureUrl || null
  );
  const [pictureFile, setPictureFile] = useState(null);
  const [name, setName] = useState<string>(
    props.data?.attributes.properties.name
  );
  const [description, setDescription] = useState<string | null>(
    props.data?.attributes.properties.description || props.description
  );
  const [tags, setTags] = useState<{ label: string; value: string }[]>(
    props.tags?.map((tag) => ({ label: tag, value: tag }))
  );
  const [tagInputValue, setTagInputValue] = useState<string>("");

  const [type, setType] = useState(
    types.find((t) => t.value === props.data?.type) || types[0]
  );

  const [position, setPosition] = useState(null);
  const [location, setLocation] = useState("");

  const [price, setPrice] = useState<string | null>(
    props.data.attributes.properties.price || null
  );
  const [category, setCategory] = useState<string | null>(
    props.data.attributes.properties.category || null
  );

  const [externalLink, setExternalLink] = useState<string | null>(
    props.data.attributes.properties.externalLink || null
  );

  const [validForm, setValidForm] = useState<boolean>(false);
  const [requestOk, setRequestOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // const {user} = useAuth();

  useEffect(() => {
    const fetchLocation = async () => {
      const response = await makeRequest(
        "GET",
        `https://api-adresse.data.gouv.fr/reverse/?lat=${position.lat}&lon=${position.lng}`
      );
      //   const body = await response.json();
      let json = JSON.parse(response as string);
      if (json?.features[0] != null)
        setLocation(json.features[0]?.properties?.label);
      else setLocation("");
    };
    if (position != null) fetchLocation();
  }, [position]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validForm) {
      setLoading(true);
      // const response = await fetchRSR("/api/resource", user, {
      //   method: "POST",
      //   body: JSON.stringify({

      //   }),
      // });
      // setRequestOk(response.ok);
      // const body = await response.json();
      setLoading(false);
      // router.push(`/resource/${body.slug}`);
    }
  };

  useEffect(() => {
    // Form Verifications
    switch (type.value) {
      case "physical_item":
        if (name && description && category) setValidForm(true);
        break;

      case "location":
        if (name && description && position && location) setValidForm(true);
        break;

      case "external_link":
        if (name && description && externalLink) setValidForm(true);
        break;

      default:
        setValidForm(false);
        break;
    }
  }, [
    pictureUrl,
    name,
    description,
    tags,
    type,
    position,
    price,
    externalLink,
    category,
  ]);

  return (
    <AppLayout>
      <div className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900 grow">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end justify-between w-full">
            <div className="flex flex-col space-y-2">
              <div className="w-auto h-auto">
                <Image src="/img/pencil.png" width={64} height={64} />
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow px-4 py-3 pb-6 bg-gray-100 rounded-tl-xl md:flex-row"
        >
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
              <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                Étiquettes
              </h4>
              <Select
                name="tags"
                className="w-full"
                isClearable
                isMulti
                menuIsOpen={false}
                value={tags}
                inputValue={tagInputValue}
                onInputChange={(e: string) => setTagInputValue(e)}
                onChange={(e: any[]) => setTags(e?.map((e: any) => e.value))}
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
                  if (!tagInputValue) return;
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
                            "focus:outline-none transition-all duration-300 focus:ring-2 ring-offset-2 ring-amber-500",
                            selected
                              ? "bg-amber-700  text-amber-100 font-semibold shadow"
                              : "text-amber-700 bg-amber-100 hover:bg-amber-300 hover:text-amber-800",
                            i === 0 ? "rounded-l-lg" : "",
                            i === types.length - 1 ? "rounded-r-lg" : ""
                          )
                        }
                      >
                        {type.label}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
              </Tab.Group>

              {(type.value === "external_link" ||
                type.value === "physical_item") && (
                <label className="flex flex-col grow">
                  <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne">
                    Image de la ressource
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
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ResourceEdit;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user },
  } = context.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };

  const res = await fetch(
    "http://localhost:3000/api/resource/" + context.params.slug
  );
  const body = await res.json();

  const resource: Resource[] = body?.data?.attributes;

  return {
    props: { ...resource },
  };
};
