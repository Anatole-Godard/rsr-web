import { Media } from "@definitions/Resource/Media";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { useCarousel } from "@hooks/useCarousel";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";
import { MediaModal } from "./Modal";
import { MediaView } from "./View";

const INTERVAL = 10000;
export const MediaCarouselView = ({ medias, updatedAt }) => {
  const { active, previous, next, wrapperStyle, IndicatorsComponent } =
    useCarousel(medias, INTERVAL);

  const [modalContent, setModalContent] = useState<Media | undefined>(
    undefined
  );

  const t = useTranslations("ResourceView");
  const { locale } = useRouter();
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
              {t("updatedAt", {
                relative: formatRelative(new Date(updatedAt), new Date(), {
                  locale: locale === "fr" ? fr : undefined,
                }),
              })}
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
