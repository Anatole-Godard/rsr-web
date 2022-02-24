import {
  LinkIcon as ExternalLinkIconOutline,
  HandIcon as HandIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
} from "@heroicons/react/outline";
import {
  LinkIcon as ExternalLinkIconSolid,
  HandIcon as HandIconSolid,
  LocationMarkerIcon as LocationMarkerIconSolid,
} from "@heroicons/react/solid";

export const types = [
  {
    label: "Objet physique",
    value: "physical_item",
    hasImage: true,
    icon: { outline: HandIconOutline, solid: HandIconSolid },
  },
  {
    label: "Emplacement GPS",
    value: "location",
    hasImage: false,
    icon: {
      outline: LocationMarkerIconOutline,
      solid: LocationMarkerIconSolid,
    },
  },
  {
    label: "Lien externe",
    value: "external_link",
    hasImage: true,
    icon: { outline: ExternalLinkIconOutline, solid: ExternalLinkIconSolid },
  },
];

export type ResourceType = {
  label: string;
  value: string;
  hasImage: boolean;
};
