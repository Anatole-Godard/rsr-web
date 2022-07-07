import { GeoJSON_Point } from "@definitions/Resource/GeoJSON";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

interface LocationViewProps {
  attributes: GeoJSON_Point;
  slug: string;
}

const Map: any = dynamic(() => import("@components/Map/Map") as any, {
  ssr: false,
});

export const LocationView = ({ attributes }: LocationViewProps) => {
  const t = useTranslations("ResourceView");
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-lg xl:col-span-2">
        <Map
          point={attributes.geometry.coordinates}
          className="h-full"
          zoom={13}
          mapEventHandler={{ click: () => {} }}
        />
      </div>
      <div className="flex flex-col pt-6">
        <h4 className="mb-3 text-3xl font-bold font-marianne">
          {t("location-address")}
        </h4>
        <div className="text-sm leading-5 prose text-gray-500 font-spectral dark:text-gray-400">
          {attributes.properties.location}
        </div>
      </div>
    </>
  );
};
