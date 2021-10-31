import type { ExternalLink } from "./Resource/ExternalLink";
import type { GeoJSON_Point } from "./Resource/GeoJSON";
import type { PhysicalItem } from "./Resource/PhysicalItem";

export type Resource = {
  id: number;
  slug: string;
  owner: string;
  createdAt: Date | string;
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
    photoURL: string;
  }[];
  validated: boolean;
};
