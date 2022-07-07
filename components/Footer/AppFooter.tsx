import { ExternalLinkIcon } from "@heroicons/react/outline";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <div className="flex flex-col w-full bg-white border-t-2 dark:bg-black border-bleuFrance ">
      <div className="grid w-full gap-4 px-6 py-6 pt-12 mb-6 text-center bg-gray-100 dark:bg-gray-900 lg:px-24 md:text-left xl:grid-cols-4 lg:grid-cols-2">
        <div className="flex flex-col text-xs">
          <h5 className="font-medium text-black dark:text-white font-marianne mb-2.5">
            {"L'actualité"}
          </h5>
          <ul className="space-y-1.5 font-light text-gray-600 dark:text-gray-400 list-none font-marianne">
            <li>{"Toute l'actualité"}</li>
            <li>{"L'actualité du Premier ministre"}</li>
            <li>{"Espace presse"}</li>
            <li>{"Agenda"}</li>
            <li>{"Discours et rapport"}</li>
          </ul>
        </div>
        <div className="flex flex-col text-xs">
          <h5 className="font-medium text-black dark:text-white font-marianne mb-2.5">
            {"Les actions du Gouvernement"}
          </h5>
          <ul className="space-y-1.5 font-light text-gray-600 dark:text-gray-400 list-none font-marianne">
            <li>{"Les actions"}</li>
            <li>{"Les portraits de la relance"}</li>
            <li>{"Conseil des ministres"}</li>
          </ul>
        </div>
        <div className="flex flex-col text-xs">
          <h5 className="font-medium text-black dark:text-white font-marianne mb-2.5">
            {"Le Gouvernement et les institutions"}
          </h5>
          <ul className="space-y-1.5 font-light text-gray-600 dark:text-gray-400 list-none font-marianne">
            <li>{"Composition du Gouvernement"}</li>
            <li>{"Services du Premier ministre"}</li>
            <li>{"Visite virtuelle de Matignon"}</li>
            <li>{"Le saviez-vous ?"}</li>
          </ul>
        </div>
        <div className="flex flex-col text-xs">
          <h5 className="font-medium text-black dark:text-white font-marianne mb-2.5">
            {"Les réseaux sociaux du Gouvernement"}
          </h5>

          <ul className="inline-flex items-center justify-center space-x-2 md:justify-start">
            <li className="">
              <a
                href="https://www.facebook.com/gouvernement.fr"
                title="Rejoignez-nous sur Facebook - nouvelle fenêtre"
                target="_blank"
                className="text-gray-600 transition-colors duration-300 dark:text-gray-400 hover:text-gray-900"
                rel="noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-5 h-5"
                  fill="currentcolor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  width="30px"
                  height="30px"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z" />
                </svg>
              </a>
            </li>
            <li className="">
              <a
                href="https://twitter.com/gouvernementfr"
                title="Retrouvez-nous sur Twitter - nouvelle fenêtre"
                target="_blank"
                className="text-gray-600 transition-colors duration-300 dark:text-gray-400 hover:text-gray-900"
                rel="noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentcolor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  width="30px"
                  height="30px"
                >
                  <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
            </li>
            <li className="">
              <a
                href="https://www.linkedin.com/company/gouvernementfr"
                title="Rejoignez-nous sur Linkedin - nouvelle fenêtre"
                target="_blank"
                className="text-gray-600 transition-colors duration-300 dark:text-gray-400 hover:text-gray-900"
                rel="noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentcolor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  width="30px"
                  height="30px"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M10.496,8.403 c0.842,0,1.403,0.561,1.403,1.309c0,0.748-0.561,1.309-1.496,1.309C9.561,11.022,9,10.46,9,9.712C9,8.964,9.561,8.403,10.496,8.403z M12,20H9v-8h3V20z M22,20h-2.824v-4.372c0-1.209-0.753-1.488-1.035-1.488s-1.224,0.186-1.224,1.488c0,0.186,0,4.372,0,4.372H14v-8 h2.918v1.116C17.294,12.465,18.047,12,19.459,12C20.871,12,22,13.116,22,15.628V20z" />
                </svg>
                <span className="sr-only">Linkedin</span>
              </a>
            </li>
            <li className="">
              <a
                href="https://www.instagram.com/gouvernementfr/"
                title="Retrouvez nous sur Instagram - nouvelle fenêtre"
                target="_blank"
                className="text-gray-600 transition-colors duration-300 dark:text-gray-400 hover:text-gray-900"
                rel="noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentcolor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="50px"
                  height="50px"
                >
                  <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" />
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </li>
          </ul>

          <p className="mt-8 font-light text-gray-600 whitespace-pre-wrap dark:text-gray-400 font-marianne">
            Sauf mention contraire, tous les contenus
            <br />
            de ce site sont sous licence
            <br />
            <a
              href="https://www.etalab.gouv.fr/licence-ouverte-open-licence"
              className="inline-flex items-center text-gray-600 underline dark:text-gray-400 hover:text-gray-900"
            >
              etalab-2.0 <ExternalLinkIcon className="w-3 h-3 ml-1" />
            </a>
          </p>
        </div>
      </div>

      <div className="inline-flex items-end justify-between w-full px-6 py-6 lg:px-24">
        <div className="flex flex-col text-black select-none dark:text-white">
          <Image
            src="/img/marianne.webp"
            alt="Marianne"
            width={506 / 8}
            height={180 / 8}
            layout="fixed"
          />
          <div className="flex flex-col mt-3 text-lg font-semibold leading-3 tracking-wide uppercase font-marianne">
            <span>Gouvernement</span>
          </div>
          <div className="mt-1.5 flex flex-col capitalize font-spectral font-light italic text-xs leading-base">
            <span>Liberté</span>
            <span>Égalité</span>
            <span>Fraternité</span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-end w-full md:items-center md:space-x-12 md:flex-row grow">
          <a className="font-semibold text-gray-700 dark:text-gray-300 font-marianne">
            elysee.fr
          </a>
          <a className="font-semibold text-gray-700 dark:text-gray-300 font-marianne">
            service-public.fr
          </a>
          <a className="font-semibold text-gray-700 dark:text-gray-300 font-marianne">
            legifrance.gouv.fr
          </a>
          <a className="font-semibold text-gray-700 dark:text-gray-300 font-marianne">
            data.gouv.fr
          </a>
          <a className="font-semibold text-gray-700 dark:text-gray-300 font-marianne">
            france.fr
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-4 pb-6 mx-6 text-xs text-gray-600 border-t border-gray-400 md:divide-x md:flex-row dark:text-gray-400 shrink-0 font-marianne lg:mx-24">
        <a className="px-2">Données personnelles et cookies</a>
        <a className="px-2">Écrire à la Première ministre</a>
        <a className="px-2">Contact presse</a>
        <a className="px-2">Mentions légales</a>
        <a className="px-2">Accessibilité: partiellement conforme</a>
        <a className="px-2">Gestion des cookies</a>
        <a className="px-2">{"Marque de l'État"}</a>
      </div>
    </div>
  );
};
