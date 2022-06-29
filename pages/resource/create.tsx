import { AppLayout } from "@components/Layout/AppLayout";
import { Resource } from "@definitions/Resource";
import { UserMinimum } from "@definitions/User";
import { Tab } from "@headlessui/react";
import {
  CheckIcon,
  CloudUploadIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { fetchXHR } from "libs/fetchXHR";
import { classes } from "libs/classes";
import { fetchRSR } from "libs/fetchRSR";
import { types, visibilities } from "constants/resourcesTypes";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MediaUploader } from "@components/Resource/Helper/Media/Uploader";
import {
  Input,
  WrapperModularInputs,
} from "@components/Resource/Helper/ModularInput";
import { TagDocument } from "@definitions/Resource/Tag";
import useFetchRSR from "@hooks/useFetchRSR";
import { Media } from "@definitions/Resource/Media";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const Map: any = dynamic(() => import("@components/Map/Map") as any, {
  ssr: false,
});

const Select: any = dynamic(() => import("react-select/creatable") as any, {
  ssr: false,
});

const ResourceCreate: NextPage<any> = ({
  membersOptions,
}: {
  membersOptions: UserMinimum[];
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations("ResourceCreate");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [tagInputValue, setTagInputValue] = useState<string>("");

  const [type, setType] = useState(types[0]);

  const [visibility, setVisibility] = useState(visibilities[0]);
  const [members, setMembers] = useState<UserMinimum[]>([]);

  const [position, setPosition] = useState(null);
  const [location, setLocation] = useState("");

  const [price, setPrice] = useState<string | null>("0.00");
  const [category, setCategory] = useState<string | null>(null);

  const [externalLink, setExternalLink] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [medias, setMedias] = useState<Media[]>([]);
  const [inputs, setInputs] = useState<Input[]>([]);

  const [validForm, setValidForm] = useState<boolean>(false);
  const [requestOk, setRequestOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

    if (type.hasMedia) data.attributes.properties.medias = [];

    return {
      description,
      tags: tags.map((tag) => tag.value),
      visibility: visibility.value,
      members,
      data,
    } as Resource;
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const response = await fetchXHR(
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
      try {
        const response = await fetchRSR("/api/resource/create", user?.session, {
          method: "POST",
          body: JSON.stringify(formatResource()),
        });

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
            toast.success(t("toast-create-success"));
            router.push(`/resource/${body.data.attributes.slug}`);
          } else setRequestOk(false);
        } else if (response.ok && medias.length === 0) {
          setRequestOk(true);
          toast.success(t("toast-create-success"));
          router.push(`/resource/${body.data.attributes.slug}`);
        }
      } catch (err) {
        toast.error(t("toast-create-error"));
        // console.log(err);
      }
      setLoading(false);
    }
  };

  // Form validations
  useEffect(() => {
    // Form Verifications
    switch (type.value) {
      case "physical_item":
        if (name && description && medias && category) setValidForm(true);
        break;

      case "location":
        if (name && description && position && location) setValidForm(true);
        break;

      case "external_link":
        if (name && description && externalLink) setValidForm(true);
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
    <AppLayout title={t("head-title")}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900 grow"
      >
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end justify-between w-full">
            <div className="flex flex-col space-y-2">
              <div className="w-auto h-auto">
                <Image
                  src="/img/partypopper.png"
                  width={64}
                  height={64}
                  alt="Partypopper"
                />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                {t("title1")}
                <span className="ml-1 text-bleuFrance-600 dark:text-bleuFrance-400">
                  {t("title2")}
                </span>
              </h3>
            </div>
            <button
              type="submit"
              className={classes(
                requestOk
                  ? "btn-green"
                  : validForm
                  ? "btn-bleuFrance"
                  : "btn-red",
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
                  {t("sent")}
                </>
              ) : validForm ? (
                <>
                  <CloudUploadIcon className="w-4 h-4 mr-1 duration-300 text-bleuFrance-700 group-active:text-white" />
                  {t("send")}
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4 mr-1 text-red-700 duration-300 group-active:text-white" />
                  {t("invalid")}
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-grow px-4 py-3 pb-6 bg-gray-100 dark:bg-gray-900 rounded-tl-xl md:flex-row">
          <div className="flex flex-col w-full px-2 space-y-3 md:w-1/2">
            <label>
              <h4 className="mb-1 text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-red-500 text-gray-700 font-mariann dark:text-gray-300">
                {t("title")}
              </h4>
              <input
                type="text"
                className="bg-gray-200 input"
                placeholder={t("title")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </label>
            <label className="flex flex-col grow">
              <h4 className="mb-1 text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-red-500 text-gray-700 font-marianne dark:text-gray-300">
                {t("description")}
              </h4>
              <textarea
                className="bg-gray-200 input grow"
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                value={description}
                placeholder={t("description")}
              ></textarea>
            </label>
            <label>
              <h4 className="-mb-2 text-sm after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-gray-700 font-marianne dark:text-gray-300">
                {t("visibility")}
              </h4>
            </label>

            <Tab.Group
              onChange={(selected) => {
                setRequestOk(null);
                setVisibility(visibilities[selected]);
                if (visibilities[selected].value !== "unlisted") setMembers([]);
              }}
            >
              <div className="inline-flex items-center w-full">
                <Tab.List className="flex space-x-2 bg-gray-100 dark:bg-gray-900 grow rounded-xl">
                  {visibilities.map((v, i) => (
                    <Tab
                      key={v.value}
                      className={({ selected }) =>
                        classes(
                          "w-full py-2.5 text-xs inline-flex items-center justify-center  leading-5 font-medium rounded-md",
                          "focus:outline-none transition-all duration-300 focus:ring-2 ring-offset-2 ring-bleuFrance-500 truncate",
                          selected
                            ? "bg-bleuFrance-700 dark:bg-bleuFrance-200 dark:text-bleuFrance-800  text-bleuFrance-100 font-semibold shadow"
                            : "text-bleuFrance-700 dark:bg-bleuFrance-900 dark:text-bleuFrance-200 bg-bleuFrance-100 hover:bg-bleuFrance-200 hover:text-bleuFrance-800 dark:hover:bg-bleuFrance-800 dark:hover:text-bleuFrance-200",
                          i === 0 ? "rounded-l-lg" : "",
                          i === visibilities.length - 1 ? "rounded-r-lg" : ""
                        )
                      }
                    >
                      {v.icon.outline({ className: "w-4 h-4 mr-1 shrink-0" })}
                      {t(v.value)}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </Tab.Group>
            {visibility.value === "unlisted" && (
              <label>
                <h4 className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300">
                  {t("members")}
                </h4>
                <Select
                  name="members"
                  className="w-full"
                  isMulti
                  placeholder={
                    <div className="text-sm font-semibold font-spectral">
                      {t("members-placeholder")}
                    </div>
                  }
                  options={membersOptions
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
                      <span className="text-xs text-gray-700 font-marianne">
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
              <h4 className="mb-1 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300">
                {t("tags")}
              </h4>
              <Select
                name="tags"
                className="w-full"
                isClearable
                isMulti
                menuIsOpen={false}
                value={tags}
                options={tagsOptions
                  ?.filter(
                    (tag: TagDocument) =>
                      !tags.includes({ value: tag.name, label: tag.name })
                  )
                  .map((tag: TagDocument) => ({
                    label: tag.name,
                    value: tag.name,
                  }))}
                inputValue={tagInputValue}
                onInputChange={(e: string) => setTagInputValue(e)}
                onChange={(e: any[]) => setTags(e?.map((e: any) => e.value))}
                placeholder={
                  <div className="text-sm font-semibold font-spectral">
                    {t("tags-placeholder")}
                  </div>
                }
                formatOptionLabel={(tag: { label: string; value: string }) => (
                  <div className="inline-flex items-center">
                    <span className="text-xs text-gray-700 font-spectral">
                      {tag.label}
                    </span>
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
                      event.preventDefault();
                  }
                }}
              />
            </label>
          </div>
          <div className="flex flex-col justify-between w-full px-2 mt-3 space-y-3 md:w-1/2 md:mt-0">
            <div className="flex flex-col w-full h-full space-y-3">
              <label>
                <h4 className="-mb-2 text-sm after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-gray-700 font-marianne dark:text-gray-300">
                  {t("type")}
                </h4>
              </label>

              <Tab.Group
                onChange={(selected) => {
                  setRequestOk(null);
                  setType(types[selected]);
                }}
              >
                <div className="inline-flex items-center w-full">
                  <Tab.List className="flex space-x-2 bg-gray-100 dark:bg-gray-900 grow rounded-xl">
                    {types.map((type, i) => (
                      <Tab
                        key={type.value}
                        className={({ selected }) =>
                          classes(
                            "w-full inline-flex items-center justify-center py-2.5 text-xs leading-5 font-medium rounded-md",
                            "focus:outline-none transition-all duration-300 focus:ring-2 ring-offset-2 ring-bleuFrance-500 truncate",
                            selected
                              ? "bg-bleuFrance-700 dark:bg-bleuFrance-200 dark:text-bleuFrance-800  text-bleuFrance-100 font-semibold shadow"
                              : "text-bleuFrance-700 dark:bg-bleuFrance-900 dark:text-bleuFrance-200 bg-bleuFrance-100 hover:bg-bleuFrance-200 hover:text-bleuFrance-800 dark:hover:bg-bleuFrance-800 dark:hover:text-bleuFrance-200",
                            i === 0 ? "rounded-l-lg" : "",
                            i === types.length - 1 ? "rounded-r-lg" : ""
                          )
                        }
                      >
                        {type.icon.outline({
                          className: "w-4 h-4 mr-1 shrink-0",
                        })}

                        {t(type.value)}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
              </Tab.Group>

              {types.find((t) => t.value === type.value).hasMedia && (
                <div className="flex flex-col h-full overflow-hidden grow">
                  <h4
                    className={classes(
                      "mb-1 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300",
                      type.value === "physical_item"
                        ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                        : ""
                    )}
                  >
                    {t("medias")}
                  </h4>

                  <MediaUploader files={medias} setFiles={setMedias} />
                </div>
              )}
              {type.value === "physical_item" && (
                <>
                  <label>
                    <h4 className="mb-1 text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-red-500 text-gray-700 font-marianne dark:text-gray-300">
                      {t("physical_item-category")}
                    </h4>
                    <input
                      type="text"
                      className="bg-gray-200 input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </label>
                  <label>
                    <h4 className="mb-1 text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-red-500 text-gray-700 font-marianne dark:text-gray-300">
                      {t("physical_item-price")}
                    </h4>
                    <input
                      type="number"
                      className="bg-gray-200 input"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </label>
                </>
              )}

              {type.value === "external_link" && (
                <>
                  <label>
                    <h4 className="mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300">
                      {t("external_link-url")}
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
                <div className="flex flex-col grow">
                  <label>
                    <h4 className="mb-1 text-sm after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-gray-700 font-marianne dark:text-gray-300">
                      {t("location-address")}
                    </h4>
                    <div className="w-full mb-3">
                      <input
                        type="text"
                        value={location}
                        className="bg-gray-200 input"
                        placeholder={t("location-address")}
                        onChange={(e) => setLocation(e.target.value)}
                      ></input>
                    </div>
                  </label>
                  <div className="flex-grow rounded-lg">
                    <Map
                      zoom={4.5}
                      className="relative inset-0 w-full h-64 rounded-lg md:h-full"
                      mapEventHandler={{ click: (e) => setPosition(e.latlng) }}
                      point={(position as number[]) || [46.227638, 2.213749]}
                    ></Map>
                  </div>
                </div>
              )}

              {type.value === "event" && (
                <>
                  <div className="flex flex-col">
                    <h4
                      className={classes(
                        "mb-1 text-sm font-semibold text-gray-700 font-marianne dark:text-gray-300"
                      )}
                    >
                      {t("event-datetime")}
                    </h4>

                    <div className="grid gap-2 xl:grid-cols-2">
                      <label className="flex flex-col">
                        <p className="after:content-['*'] text-gray-500 after:ml-0.5 after:text-red-500 text-xs font-spectral">
                          {t("event-datetime-start")}
                        </p>
                        <input
                          placeholder={t("event-datetime-start")}
                          className="bg-gray-200 input "
                          type="datetime-local"
                          onChange={(e) => setStartDate(e.target.value)}
                          value={startDate}
                        />
                      </label>
                      <label className="flex flex-col">
                        <p className="text-xs text-gray-500 font-spectral">
                          {t("event-datetime-end")}
                        </p>
                        <input
                          placeholder={t("event-datetime-end")}
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
    </AppLayout>
  );
};

export default ResourceCreate;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    cookies: { user },
  } = ctx.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  const body = await (await fetch("http://localhost:3000/api/user")).json();
  return {
    props: {
      membersOptions: body?.data?.attributes,
      i18n: (await import(`../../i18n/${ctx.locale}.json`)).default,
    },
  };
};
