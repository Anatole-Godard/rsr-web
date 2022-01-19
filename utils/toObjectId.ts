export const toObjectId = (str: string) => {
  const ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(str.toString());
};
