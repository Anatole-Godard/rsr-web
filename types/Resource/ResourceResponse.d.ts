import type { Resource } from "@types/Resource";

export type ResourceResponse =
  | {
      data: {
        type: string;
        id: number | string;
        attributes: Resource | Resource[] | null;
      };
    }
  | {
      error: {
        code: number;
        message: any;
      };
    };
