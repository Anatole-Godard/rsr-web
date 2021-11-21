import type { ExternalLink } from "./Resource/ExternalLink";
import type { GeoJSON_Point } from "./Resource/GeoJSON";
import type { PhysicalItem } from "./Resource/PhysicalItem";
import type { UserMinimum } from "./User";

export type Resource = {
  slug: string;

  owner: UserMinimum;
  createdAt: Date | string;
  description?: string;
  tags?: string[];
  data: {
    type: "location" | "physical_item" | "external_link" | string;
    attributes: GeoJSON_Point | PhysicalItem | ExternalLink | any;
  }; // à définir,
  likes: UserMinimum[];
  comments?: {
    owner: {
      uid: string;
      fullName: string;
      photoURL: string;
    };
    content: string;
    createdAt: Date | string;
  }[];
  validated: boolean;
};
