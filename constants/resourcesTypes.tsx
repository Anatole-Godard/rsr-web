import {
  LinkIcon as ExternalLinkIconOutline,
  HandIcon as HandIconOutline,
  LocationMarkerIcon as LocationMarkerIconOutline,
  LockClosedIcon as LockClosedIconOutline,
  GlobeIcon as GlobeIconOutline,
  BanIcon as BanIconOutline,
  CalendarIcon as CalendarIconOutline,
  QuestionMarkCircleIcon as QuestionMarkCircleIconOutline,
} from "@heroicons/react/outline";
import {
  LinkIcon as ExternalLinkIconSolid,
  HandIcon as HandIconSolid,
  LocationMarkerIcon as LocationMarkerIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  GlobeIcon as GlobeIconSolid,
  BanIcon as BanIconSolid,
  CalendarIcon as CalendarIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
} from "@heroicons/react/solid";
import { ComponentProps, SVGProps } from "react";

type Props = ComponentProps<"svg">;

const HandIconOutlineFnc = (props: Props) => <HandIconOutline {...props} />;
const HandIconSolidFnc = (props: Props) => <HandIconSolid {...props} />;
const ExternalLinkIconOutlineFnc = (props: Props) => (
  <ExternalLinkIconOutline {...props} />
);
const ExternalLinkIconSolidFnc = (props: Props) => (
  <ExternalLinkIconSolid {...props} />
);
const LocationMarkerIconOutlineFnc = (props: Props) => (
  <LocationMarkerIconOutline {...props} />
);
const LocationMarkerIconSolidFnc = (props: Props) => (
  <LocationMarkerIconSolid {...props} />
);
const CalendarIconOutlineFnc = (props: Props) => (
  <CalendarIconOutline {...props} />
);
const CalendarIconSolidFnc = (props: Props) => <CalendarIconSolid {...props} />;

const QuestionMarkCircleIconOutlineFnc = (props: Props) => (
  <QuestionMarkCircleIconOutline {...props} />
);
const QuestionMarkCircleIconSolidFnc = (props: Props) => (
  <QuestionMarkCircleIconSolid {...props} />
);

const GlobeIconOutlineFnc = (props: Props) => <GlobeIconOutline {...props} />;
const GlobeIconSolidFnc = (props: Props) => <GlobeIconSolid {...props} />;
const BanIconOutlineFnc = (props: Props) => <BanIconOutline {...props} />;
const BanIconSolidFnc = (props: Props) => <BanIconSolid {...props} />;
const LockClosedIconOutlineFnc = (props: Props) => (
  <LockClosedIconOutline {...props} />
);
const LockClosedIconSolidFnc = (props: Props) => (
  <LockClosedIconSolid {...props} />
);

export type ResourceType = {
  label: string;
  value: "physical_item" | "location" | "external_link" | "event" | "other";
  hasMedia: boolean;
  icon: Icon;
};

export const types: ResourceType[] = [
  {
    label: "Objet",
    value: "physical_item",
    hasMedia: true,
    icon: { outline: HandIconOutlineFnc, solid: HandIconSolidFnc },
  },
  {
    label: "Lieu",
    value: "location",
    hasMedia: false,
    icon: {
      outline: LocationMarkerIconOutlineFnc,
      solid: LocationMarkerIconSolidFnc,
    },
  },
  {
    label: "Lien hypertexte",
    value: "external_link",
    hasMedia: true,
    icon: {
      outline: ExternalLinkIconOutlineFnc,
      solid: ExternalLinkIconSolidFnc,
    },
  },
  {
    label: "Événement",
    value: "event",
    hasMedia: true,
    icon: { outline: CalendarIconOutlineFnc, solid: CalendarIconSolidFnc },
  },
  {
    label: "Autre",
    value: "other",
    hasMedia: true,
    icon: {
      outline: QuestionMarkCircleIconOutlineFnc,
      solid: QuestionMarkCircleIconSolidFnc,
    },
  },
];

export type ResourceVisibility = {
  label: string;
  value: "public" | "private" | "unlisted";
  icon: Icon;
};

export const visibilities: ResourceVisibility[] = [
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

type Icon = {
  outline: (props: React.ComponentProps<"svg">) => JSX.Element;
  solid: (props: React.ComponentProps<"svg">) => JSX.Element;
};
