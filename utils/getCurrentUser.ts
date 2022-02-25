import User from "@models/User";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

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

export const getUser = async (req: NextApiRequest) => {
  if (!req.headers.uid) return null;
  const data = await User.findOne({ _id: req.headers.uid })
    .select("-password")
    .lean();
  return { ...data, uid: data._id.toString() };
};

export const isAdmin = async (req: NextApiRequest, moderator:boolean = false) => {
  const user = await getUser(req)
  const isValid = (user && (user?.role === "admin" || user?.role === "superadmin" ));
  return moderator ? (isValid || user?.role === "moderator" ): isValid;
};
