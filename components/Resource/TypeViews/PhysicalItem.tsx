import { MediaCarouselView } from "@components/Resource/Helper/Media/Carousel";
import { PhysicalItem } from "@definitions/Resource/PhysicalItem";
import { HandIcon } from "@heroicons/react/outline";

interface PhysicalItemViewProps {
  attributes: PhysicalItem;
  slug: string;
  updatedAt: string;
}

export const PhysicalItemView = ({
  attributes,
  slug,
  updatedAt,
}: PhysicalItemViewProps) => {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        {attributes.properties.medias ? (
          <MediaCarouselView
            medias={attributes.properties.medias}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-emerald-800 bg-emerald-200 dark:text-emerald-200 dark:bg-emerald-800">
            <HandIcon className="w-12 h-12 mb-1" />
            <p className="text-lg font-spectral">Objet physique</p>
            {!attributes.properties.medias && (
              <p className="pt-2 mx-12 mt-2 text-sm text-center border-t border-emerald-500 text-emerald-600 dark:text-emerald-400 font-spectral">
                {"Aucun média n'est disponible pour cette ressource"}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="">
        <div className="flex flex-col pt-6">
          <h4 className="mb-3 text-3xl font-bold font-marianne">Catégorie</h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            {attributes.properties.category}
          </div>
        </div>
        <div className="flex flex-col pt-6">
          <h4 className="mb-3 text-3xl font-bold font-marianne">Prix</h4>
          <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
            {attributes.properties.price}
          </div>
        </div>
      </div>
    </>
  );
};
