import { fakeResource } from "@utils/faker.dev";

export type ExternalLink = {
  properties: {
    url: string;
    name: string;
    description: string;
    image: string;
  };
};
