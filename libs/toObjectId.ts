const ObjectId = require("mongoose").Types.ObjectId;
/**
 * It converts a string to a mongoose ObjectId.
 * @param {string} str - The string to convert to an ObjectId.
 * @returns A promise.
 */
export const toObjectId = (str: string) => {
  return new ObjectId(str.toString());
};
