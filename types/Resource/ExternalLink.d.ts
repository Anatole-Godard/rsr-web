export type ExternalLink = {
  properties: {
    url: string;
    name: string;
    description: string;
    medias: any;
  };
};

export type ExternalLinkWithoutRedundancy = {
  url: string;
};
