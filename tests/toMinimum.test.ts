const _MOCK_DATA = {
  _id: "62a84c159ce73393b7f4df94",
  slug: "rouen",
  owner: {
    fullName: "Florian Leroux",
    photoURL: "default.png",
    uid: "id",
  },
  description: "C'est une ville",
  tags: [
    {
      _id: "62a48a75a16e103dfaeea405",
      name: "ville",
      createdAt: "2022-06-11T12:28:37.761Z",
      owner: {
        uid: "id",
        fullName: "Florian Leroux",
        photoURL: "default.png",
      },
      validated: true,
    },
    {
      _id: "62a48a75a16e103dfaeea406",
      name: "city",
      createdAt: "2022-06-11T12:28:37.762Z",
      owner: {
        uid: "id",
        fullName: "Florian Leroux",
        photoURL: "default.png",
      },
      validated: false,
    },
  ],
  data: {
    type: "other",
    attributes: {
      properties: {
        name: "Rouen",
        description: "C'est une ville",
        habitants: {
          label: "Habitants",
          slug: "habitants",
          value: 300001,
          type: "number",
        },
        prefecture: {
          label: "Préfecture",
          slug: "prefecture",
          value: true,
          type: "boolean",
        },
        departement: {
          label: "Département",
          slug: "departement",
          value: "Seine-Maritime",
          type: "string",
        },
        medias: [],
      },
    },
  },
  likes: [
    {
      uid: "id",
      fullName: "Florian Leroux",
      photoURL: "default.png",
    },
    {
      uid: "id2",
      fullName: "Ophélie",
      photoURL: "default.png",
    },
  ],
  comments: [
    {
      content: "Bonjour",
      owner: {
        uid: "id",
        fullName: "Florian Leroux",
        photoURL: "default.png",
      },
      createdAt: "2022-06-21T20:00:57.679Z",
    },
    {
      content: "Coucou",
      owner: {
        uid: "id2",
        fullName: "Ophélie",
        photoURL: "default.png",
      },
      createdAt: "2022-06-21T20:01:05.738Z",
    },
  ],
  validated: true,
  visibility: "public",
  members: [],
  seenBy: [
    {
      uid: "id",
      fullName: "Florian Leroux",
      photoURL: "default.png",
    },
    {
      uid: "id2",
      fullName: "Ophélie",
      photoURL: "default.png",
    },
  ],
  createdAt: "2022-06-14T08:51:33.129Z",
  __v: 22,
  updatedAt: "2022-06-14T09:05:02.171Z",
};

import { Resource } from "@definitions/Resource";
import { toResourceMinimum } from "@utils/toMinimum";

describe("allow to convert a resource to a resource minimum", () => {
  it("should convert a resource to a resource minimum", async () => {
    const resource: Resource = _MOCK_DATA as Resource;
    const resourceMinimum = toResourceMinimum(resource);
    expect(resourceMinimum).toEqual({
      slug: resource.slug,
      description: resource.description,
      tags: resource.tags,
      data: resource.data,
      owner: resource.owner,
      validated: resource.validated,
      createdAt: resource.createdAt,
      visibility: resource.visibility,
      members: resource.members,
      seenBy: resource.seenBy,
    });
  });

  it("should throw an error if no resource", async () => {
    expect(() => toResourceMinimum(undefined)).toThrow("resource is required");
  });
});
