export const faker = require("faker/locale/fr");

export const fakeChannelInvite = () => {
  const expirationType = faker.random.arrayElement([
    "temporary",
    "uses",
    "none",
  ]);

  return {
    token: faker.datatype.uuid().toString(),
    channelSlug: faker.random.word().toLocaleLowerCase(),
    expirationType: expirationType.toString(),
    expiresAt:
      expirationType === "temporary" && faker.date.future().toISOString(),
    maxUses: expirationType === "uses" && faker.datatype.number(),
  };
};

export const fakeUser = () => ({
  fullName: faker.name.findName(),
  birthDate: faker.date.past().toISOString(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: faker.random.arrayElement(["user", "admin"]),
  createdAt: faker.date.past(),
  photoURL: faker.image.avatar(),
});

export const fakeExternalLink = () => ({
  url: faker.internet.url(),
  name: faker.lorem.words(),
  description: faker.lorem.sentences(),
  image: faker.image.imageUrl(),
});
export const fakeGeoJSON_Point = () => {
  // const type = faker.random.arrayElement(["Feature", "FeatureCollection"]);
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        faker.address.latitude(41.59101, 51.03457),
        faker.address.longitude(-4.65, 9.45),
      ],
    },
    properties: { name: faker.address.city() },
  };
};

export const fakePhysicalItem = () => ({
  name: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  photoURL: faker.image.imageUrl(),
  price: faker.datatype.number(),
  category: faker.commerce.department(),
});

export const fakeResource = () => {
  const datatype = faker.random.arrayElement([
    "location",
    "physical_item",
    "external_link",
  ]);

  return {
    id: faker.datatype.number(),
    slug: faker.lorem.slug(),
    owner: faker.internet.userName(),
    createdAt: faker.date.past(),
    description: faker.lorem.sentence(),
    data: {
      type: datatype,
      attributes:
        datatype === "location"
          ? fakeGeoJSON_Point()
          : datatype === "physical_item"
          ? fakePhysicalItem()
          : fakeExternalLink(),
    },
    likes: faker.datatype.number(),
    comments: new Array(faker.datatype.number(10)).fill(null).map(() => ({
      owner: faker.internet.userName(),
      content: faker.lorem.sentence(),
      photoURL: faker.image.avatar(),
    })),

    validated: faker.datatype.boolean(),
  };
};
