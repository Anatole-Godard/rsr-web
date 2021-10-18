import type { GeoJSON_Point } from "./Resource/GeoJSON";
import type { PhysicalItem } from "./Resource/PhysicalItem";

export type Resource = {
  id: number;
  slug: string;
  owner: string;
  createdAt: Date;
  description: string;
  data: {
    type: string;
    attributes: GeoJSON_Point | PhysicalItem | any;
  }; // à définir,
  likes: number;
  comments: {
    owner: string;
    content: string;
    photoUrl: string;
  }[];
  validated: boolean;
};
