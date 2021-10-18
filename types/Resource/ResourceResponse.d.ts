import type { Resource } from "@types/Resource";

export type ResourceResponse = {
  data: {
    type: string;
    id: number | string;
    attributes: Resource | Resource[];
  };
};
