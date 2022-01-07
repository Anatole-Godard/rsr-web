import { AppLayout } from "@components/layouts/AppLayout";
import {
  BadgeCheckIcon,
  CheckIcon,
  CloudUploadIcon,
  PlusCircleIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { makeRequest } from "@utils/asyncXHR";
import { classes } from "@utils/classes";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Map: any = dynamic(() => import("@components/map/Map") as any, {
  ssr: false,
});

const ResourceCreate: NextPage<any> = () => {
  const router = useRouter();

  const [pictureUrl, setPictureUrl] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [position, setPosition] = useState(null);
  const [location, setLocation] = useState("");

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

  return (
    <AppLayout>
      <div className="flex flex-col w-full max-h-full bg-white dark:bg-gray-900 grow">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex justify-between w-full">
            <h3 className="mb-2 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              Créer une
              <span className="ml-1 text-blue-600 dark:text-blue-400">
                ressource
              </span>
            </h3>
            <button
              className={classes(
                requestOk ? "btn-green" : validForm ? "btn-blue" : "btn-red"
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
                  <CheckIcon className="w-4 h-4 mr-1 text-green-700" /> Envoyé
                </>
              ) : validForm ? (
                <>
                  <CloudUploadIcon className="w-4 h-4 mr-1 text-blue-700" />
                  Envoyer
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4 mr-1 text-red-700" /> Non
                  valide
                </>
              )}
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow px-2 py-3 bg-gray-100 rounded-tl-xl md:flex-row"
        >
          <div className="flex flex-col w-full px-2 space-y-3 md:w-1/2">
            {pictureUrl && (
              <div className="relative w-full">
                <img
                  src={pictureUrl}
                  className="object-cover object-center w-full rounded-lg max-h-52"
                ></img>
                <div
                  className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 -mt-1 -mr-1 transition duration-300 bg-red-600 rounded-full cursor-pointer hover:bg-red-800"
                  onClick={() => {
                    setPictureUrl(null);
                    setPictureFile(null);
                  }}
                >
                  <XIcon className="w-4 h-4 text-white" />
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
                    let file = e.target.files[0];
                    setPictureUrl(URL.createObjectURL(e.target.files[0]));
                    setPictureFile(file);
                  }}
                  className="hidden"
                ></input>
                <label
                  htmlFor="filePicture"
                  className="inline-flex items-center w-full text-2xl font-extrabold"
                >
                  <div className="flex items-center justify-center w-full h-48 p-3 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded-lg appearance-none focus:outline-none focus:bg-gray-50 focus:border-gray-200">
                    <PlusCircleIcon className="w-8 h-8 mr-4" />
                    Ajouter une photo
                  </div>
                </label>
              </div>
            )}

            <input
              type="text"
              className="bg-gray-200 input"
              placeholder="Titre"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <textarea
              className="bg-gray-200 input grow"
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              placeholder="Description de la ressource"
            ></textarea>
          </div>
          <div className="flex flex-col justify-between w-full px-2 mt-3 space-y-3 md:w-1/2 md:mt-0">
            <div className="flex flex-col w-full h-full mt-1 space-y-3">
              <div className="w-full">
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
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ResourceCreate;
