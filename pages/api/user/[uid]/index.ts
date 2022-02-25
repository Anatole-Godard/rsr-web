import withDatabase from "@middleware/mongoose";
import Resource from "@models/Resource";
import User from "@models/User";
import { handleError } from "@utils/handleError";
import { toObjectId } from "@utils/toObjectId";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  const { uid: headersUid = undefined } = req.headers as {
    uid: string | undefined;
  };

  try {
    const query = await User.findOne({ _id: uid }).select([
      "-password",
      "-role",
      "-__v",
    ]);
    const resources = await Resource.find({
      $or: [
        { "owner.uid": toObjectId(uid as string) },
        { "owner.uid": uid as string },
      ],
      ...(headersUid
        ? { $or: [{ "members.uid": headersUid }, { "owner.uid": headersUid }] }
        : null),
    });
    const user = {
      ...query.toObject(),
      uid: query._id.toString(),
      resources: resources.map((resource) => resource.toObject()) || [],
    };

    res.status(200).json({
      data: {
        attributes: user,
      },
      error: null,
    });
  } catch (err) {
    handleError(res, err, "user/uid");
  }
}

export default withDatabase(handler);
