import User from "@models/User";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

/**
 * It takes a NextApiRequest and returns a Promise that resolves to a user object
 * @param {NextApiRequest} req - NextApiRequest
 * @returns A user object.
 */
export const getUserFromRequest = async (req: NextApiRequest) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return null;
  }

  const [, token] = authorization.split(" ");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  console.log({ decoded, token });

  return Promise.resolve(decoded);
};

/**
 * Get a user by their ID
 * @param {NextApiRequest} req - NextApiRequest
 * @returns The user object with an additional uid property.
 */
export const getUser = async (req: NextApiRequest) => {
  if (!req.headers.uid) return null;
  const data = await User.findOne({ _id: req.headers.uid })
    .select("-password")
    .lean();
  return { ...data, uid: data._id.toString() };
};

/**
 * It checks if the user is an admin or a superadmin.
 * @param {NextApiRequest} req - NextApiRequest
 * @param {boolean} [moderator=false] - boolean
 * @returns A boolean value.
 */
export const isAdmin = async (
  req: NextApiRequest,
  moderator: boolean = false
) => {
  const user = await getUser(req);
  const isValid =
    user && (user?.role === "admin" || user?.role === "superadmin");
  return moderator ? isValid || user?.role === "moderator" : isValid;
};
