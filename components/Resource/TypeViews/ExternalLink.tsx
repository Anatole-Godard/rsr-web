import { ExternalLink } from "@definitions/Resource/ExternalLink";
import { LinkIcon } from "@heroicons/react/outline";
import { MediaCarouselView } from "@components/Resource/Helper/Media/Carousel";
import { useTranslations } from "next-intl";

interface ExternalLinkViewProps {
  attributes: ExternalLink;
  slug: string;
  updatedAt: string;
}

export const ExternalLinkView = ({
  attributes,

  updatedAt,
}: ExternalLinkViewProps) => {
  const t = useTranslations("ResourceView");
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.medias ? (
          <MediaCarouselView
            medias={attributes.properties.medias}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-amber-800 bg-amber-200 dark:text-amber-200 dark:bg-amber-800">
            <LinkIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">{t("external_link")}</p>
            {!attributes.properties.medias && (
              <p className="pt-2 mx-12 mt-2 text-sm text-center border-t border-amber-500 text-amber-600 dark:text-amber-400 font-spectral">
                {t("no-media")}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="">
        <div className="flex flex-col pt-6">
          <h4 className="mb-3 text-3xl font-bold font-marianne">
            {t("external_link")}
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
