import { MediaCarouselView } from "@components/Resource/Helper/Media/Carousel";
import { Other } from "@definitions/Resource/Other";
import {
  CalculatorIcon,
  CalendarIcon,
  CheckCircleIcon,
  MenuAlt2Icon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import { toModularInput } from "@utils/toModularInput";
import { Fragment } from "react";

interface OtherViewProps {
  attributes: Other;
  slug: string;
  updatedAt: string;
}

export const OtherView = ({ attributes, slug, updatedAt }: OtherViewProps) => {
  console.log(updatedAt);

  return (
    <>
      <div className="relative min-h-[18rem] md:min-h-0 h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.medias ? (
          <MediaCarouselView
            medias={attributes.properties.medias}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-800">
            <QuestionMarkCircleIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Autre</p>
            {!attributes.properties.image && (
              <p className="pt-2 mx-12 mt-2 text-sm text-center text-gray-600 border-t border-gray-500 dark:text-gray-400 font-spectral">
                {"Aucun média n'est disponible pour cette ressource"}
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
