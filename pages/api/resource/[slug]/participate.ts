import { UserMinimum } from "@definitions/User";
import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import ResourceModel from "@models/Resource";
import { getUser } from "libs/getCurrentUser";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  try {
    const user = JSON.parse(JSON.stringify(await getUser(req)));

    if (!user) {
      res.status(401).json({
        data: null,
        error: {
          code: 401,
          name: "UnauthorizedError",
          message: "Unauthorized",
        },
      });
      return;
    }

    const resource = await ResourceModel.findOne({ slug });

    if (!resource) {
      res.status(404).json({
        data: null,
        error: {
          code: 404,
          name: "NotFoundError",
          message: "Resource not found",
        },
      });
      return;
    }

    if (resource.data.type !== "event") {
      res.status(400).json({
        data: null,
        error: {
          code: 400,
          name: "BadRequestError",
          message: "Resource is not an event",
        },
      });
      return;
    }

    if (
      resource.data.attributes.properties.participants.find(
        (p: UserMinimum) => p.uid === user._id.toString()
      )
    ) {
      resource.data.attributes.properties.participants =
        resource.data.attributes.properties.participants.filter(
          (p: UserMinimum) => p.uid !== user._id.toString()
        );
    } else {
      resource.data.attributes.properties.participants.push({
        uid: user._id.toString(),
        fullName: user.fullName,
        photoURL: user.photoURL,
      });
    }

    resource.markModified("data.attributes.properties.participants");
    await resource.save();

    return res.status(200).json({
      data: {
        attributes: resource,
        id: resource._id,
        type: "resource",
      },
      error: null,
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "resource/slug/participate");
  }
};

export default withAuth(withDatabase(handler));
