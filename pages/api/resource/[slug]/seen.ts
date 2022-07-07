import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "libs/getCurrentUser";
import Resource from "@models/Resource";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;
  if (!slug) {
    res
      .status(400)
      .json({
        data: null,
        error: { message: "Missing slug", name: "BadRequestError", code: 400 },
      });
    return;
  }

  const user = await getUser(req);
  if (!user) {
    res
      .status(401)
      .json({
        data: null,
        error: {
          message: "Unauthorized",
          name: "UnauthorizedError",
          code: 401,
        },
      });
    return;
  }

  const resource = await Resource.findOne({ slug });
  if (!resource) {
    res
      .status(404)
      .json({
        data: null,
        error: {
          message: "Resource not found",
          name: "ResourceNotFound",
          code: 404,
        },
      });
    return;
  }

  const seen = resource.seenBy.some((r) => r.uid === user.uid && true);

  if (seen) {
    res
      .status(400)
      .json({
        data: null,
        error: { message: "Already seen", name: "AlreadySeenError", code: 400 },
      });
    return;
  } else {
    resource.seenBy.push({
      uid: user.uid,
      fullName: user.fullName,
      photoURL: user.photoURL,
    });
    resource.markModified("seenBy");
    await resource.save();
    return res
      .status(200)
      .json({
        data: { attributes: resource, type: "resource", id: resource._id },
        error: null,
      });
  }
};

export default withAuth(withDatabase(handler));
