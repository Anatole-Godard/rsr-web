import { GeoJSON_Point } from "./ResourceTypes/GeoJSON";

export type Resource = {
  id: number;
  slug: string;
  owner: string;
  createdAt: Date;
  description: string;
  data: GeoJSON_Point | any; // à définir,
  likes: number;
  comments: {
    owner: string;
    content: string;
    photoUrl: string;
  }[];
};
