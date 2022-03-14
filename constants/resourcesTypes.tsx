import {
  LinkIcon as ExternalLinkIconOutline,
  HandIcon as HandIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
  LockClosedIcon as LockClosedIconOutline,
  GlobeIcon as GlobeIconOutline,
  BanIcon as BanIconOutline,
  CalendarIcon as CalendarIconOutline,
} from "@heroicons/react/outline";
import {
  LinkIcon as ExternalLinkIconSolid,
  HandIcon as HandIconSolid,
  LocationMarkerIcon as LocationMarkerIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  GlobeIcon as GlobeIconSolid,
  BanIcon as BanIconSolid,
  CalendarIcon as CalendarIconSolid,
} from "@heroicons/react/solid";

const HandIconOutlineFnc = (props) => <HandIconOutline {...props} />;
const HandIconSolidFnc = (props) => <HandIconSolid {...props} />;
const ExternalLinkIconOutlineFnc = (props) => (
  <ExternalLinkIconOutline {...props} />
);
const ExternalLinkIconSolidFnc = (props) => (
  <ExternalLinkIconSolid {...props} />
);
const LocationMarkerIconOutlineFnc = (props) => (
  <LocationMarkerIconOutline {...props} />
);
const LocationMarkerIconSolidFnc = (props) => (
  <LocationMarkerIconSolid {...props} />
);
const CalendarIconOutlineFnc = (props) => <CalendarIconOutline {...props} />;
const CalendarIconSolidFnc = (props) => <CalendarIconSolid {...props} />;

const GlobeIconOutlineFnc = (props) => <GlobeIconOutline {...props} />;
const GlobeIconSolidFnc = (props) => <GlobeIconSolid {...props} />;
const BanIconOutlineFnc = (props) => <BanIconOutline {...props} />;
const BanIconSolidFnc = (props) => <BanIconSolid {...props} />;
const LockClosedIconOutlineFnc = (props) => (
  <LockClosedIconOutline {...props} />
);
const LockClosedIconSolidFnc = (props) => <LockClosedIconSolid {...props} />;

export const types = [
  {
    label: "Objet physique",
    value: "physical_item",
    hasImage: true,
    icon: { outline: HandIconOutlineFnc, solid: HandIconSolidFnc },
  },
  {
    label: "Emplacement GPS",
    value: "location",
    hasImage: false,
    icon: {
      outline: LocationMarkerIconOutlineFnc,
      solid: LocationMarkerIconSolidFnc,
    },
  },
  {
    label: "Lien externe",
    value: "external_link",
    hasImage: true,
    icon: {
      outline: ExternalLinkIconOutlineFnc,
      solid: ExternalLinkIconSolidFnc,
    },
  },
  {
    label: "Événement",
    value: "event",
    hasImage: true,
    icon: { outline: CalendarIconOutlineFnc, solid: CalendarIconSolidFnc },
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
    icon: { outline: GlobeIconOutlineFnc, solid: GlobeIconSolidFnc },
  },
  {
    label: "Privée",
    value: "private",
    icon: { outline: LockClosedIconOutlineFnc, solid: LockClosedIconSolidFnc },
  },
  {
    label: "Non répertoriée",
    value: "unlisted",
    icon: { outline: BanIconOutlineFnc, solid: BanIconSolidFnc },
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
