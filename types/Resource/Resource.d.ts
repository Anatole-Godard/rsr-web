import type { ExternalLink } from "./ExternalLink";
import type { GeoJSON_Point } from "./GeoJSON";
import type { PhysicalItem } from "./PhysicalItem";

export type Resource = {
  id: number;
  slug: string;
  owner: string;
  createdAt: Date;
  description: string;
  tags?: string[];
  data: {
    type: "location" | "physical_item" | "external_link" | string;
    attributes: GeoJSON_Point | PhysicalItem | ExternalLink | any;
  }; // à définir,
  likes: number;
  comments: {
    owner: string;
    content: string;
    photoUrl: string;
  }[];
  validated: boolean;
};
