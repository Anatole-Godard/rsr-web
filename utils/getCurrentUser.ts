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

export const getUser = async (req: NextApiRequest) =>
  req.headers.uid ? User.findOne({ _id: req.headers.uid }).lean() : null;
