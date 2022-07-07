import { toObjectId } from "@utils/toObjectId";

import ObjectId  from "mongoose";

describe("allow to convert a string to a mongoose ObjectId", () => {
  it("should convert a string to a mongoose ObjectId", async () => {
    const str = "5e9f8f8f8f8f8f8f8f8f8f8f";
    const objectId = await toObjectId(str);
    expect(objectId).toBeInstanceOf(ObjectId);
    expect(objectId.toString()).toBe(str);
  });

  it("should throw an error if str is not provided", async () => {
    await expect(() => toObjectId(undefined)).toThrow("str is required");
  });

  it("should throw an error if argument passed in is not a string of 12 bytes or a string of 24 hex characters or an integer", async () => {
    await expect(() => toObjectId("id")).toThrow();
  });
});
