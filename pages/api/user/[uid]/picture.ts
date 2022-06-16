import withDatabase from "@middleware/mongoose";
import Notification from "@models/Notification";
import Resource from "@models/Resource";
import User from "@models/User";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs").promises;
import formidable from "formidable";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  const form = new formidable.IncomingForm();

  form.parse(
    req,
    async (
      err: { message: any },
      fields: { name: string; size: string; type: string },
      files: any
    ) => {
      if (err) {
        res.status(500).json({
          data: null,
          error: {
            code: 500,
            message: err.message,
          },
        });
        return;
      }

      if (!uid) {
        res.status(400).json({
          data: null,
          error: {
            code: 400,
            message: "bad request",
            fields: { uid },
          },
        });
        return;
      }

      if (req.method !== "POST") {
        res.status(405).json({
          data: null,
          error: {
            code: 405,
            message: "method not allowed",
          },
        });
        return;
      }

      const user = await User.findOne({ _id: uid }).select("photoURL");

      if (!user) {
        res.status(404).json({
          data: null,
          error: {
            code: 404,
            message: "not found",
          },
        });
        return;
      }

      try {
        await fs.writeFile(
          `/usr/src/app/public/uploads/user/${uid}.${fields.name.split(".").at(-1)}`,
          await fs.readFile(files.file.filepath)
        );
        user.photoURL = `/uploads/user/${uid}.${fields.name.split(".").at(-1)}`;
        await user.save();

        await Resource.updateMany(
          { "owner.uid": uid },
          { $set: { "owner.photoURL": user.photoURL } }
        );

        await Resource.updateMany(
          { comments: { $elemMatch: { "owner.uid": uid } } },
          { $set: { "comments.$.owner.photoURL": user.photoURL } }
        );

        await Resource.updateMany(
          { likes: { $elemMatch: { "owner.uid": uid } } },
          { $set: { "likes.$.owner.photoURL": user.photoURL } }
        );

        await Notification.updateMany(
          { "emitter.uid": uid },
          { $set: { "emitter.photoURL": user.photoURL } }
        );
        await Notification.updateMany(
          { "user.uid": uid },
          { $set: { "user.photoURL": user.photoURL } }
        );

        await Notification.updateMany(
          { "document.owner.uid": uid },
          { $set: { "document.owner.photoURL": user.photoURL } }
        );
        

        res.status(200).json({
          data: {
            attributes: user,
          },
          error: null,
        });
      } catch (err) {
        handleError(res, err, "user/picture");
      }
    }
  );
}

export default withDatabase(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
