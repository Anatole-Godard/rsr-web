import {
  LinkIcon as ExternalLinkIconOutline,
  HandIcon as HandIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
  LockClosedIcon as LockClosedIconOutline,
  GlobeIcon as GlobeIconOutline,
  BanIcon as BanIconOutline,
} from "@heroicons/react/outline";
import {
  LinkIcon as ExternalLinkIconSolid,
  HandIcon as HandIconSolid,
  LocationMarkerIcon as LocationMarkerIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  GlobeIcon as GlobeIconSolid,
  BanIcon as BanIconSolid,
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
  icon: Icon;
};

export const visibilities = [
  {
    label: "Publique",
    value: "public",
    icon: { outline: GlobeIconOutline, solid: GlobeIconSolid },
  },
  {
    label: "Privée",
    value: "private",
    icon: { outline: LockClosedIconOutline, solid: LockClosedIconSolid },
  },
  {
    label: "Non répertoriée",
    value: "unlisted",
    icon: { outline: BanIconOutline, solid: BanIconSolid },
  },
];

export type ResourceVisibility = {
  label: string;
  value: string;
  icon: Icon;
};

type Icon = {
  outline: (props: React.ComponentProps<"svg">) => JSX.Element;
  solid: (props: React.ComponentProps<"svg">) => JSX.Element;
};
