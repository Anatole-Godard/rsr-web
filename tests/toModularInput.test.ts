import { Resource } from "@definitions/Resource";
import { toModularInput } from "@utils/toModularInput";
const _MOCK_DATA_: Resource["data"]["attributes"]["properties"] = {
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
};

describe("allow to convert a other-typed resource properties to a modular input data", () => {
  it("should convert a other-typed resource properties to a modular input data", async () => {
    const properties = _MOCK_DATA_;
    const modularInput = toModularInput(properties);
    expect(modularInput).toBeInstanceOf(Array);
    expect(modularInput).toHaveLength(
      Object.keys(properties).length - ["name", "description", "medias"].length
    );
  });

  it("should throw an error if properties is not provided", async () => {
    expect(() => toModularInput(undefined)).toThrow("properties is required");
  });

  it("should throw an error if argument passed in is not a object", async () => {
    expect(() => toModularInput("properties")).toThrow(
      "properties must be an object"
    );
  });
});
