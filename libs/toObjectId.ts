const ObjectId = require("mongoose").Types.ObjectId;
/**
 * It converts a string to a mongoose ObjectId.
 * @param {string} str - The string to convert to an ObjectId.
 * @returns A promise.
 */
export const toObjectId = (str: string) => {
  if (!str) throw new Error("str is required");

  return new ObjectId(str.toString());
};
