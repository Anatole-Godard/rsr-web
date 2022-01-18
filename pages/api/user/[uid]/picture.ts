import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import User from "@models/User";
import { handleError } from "@utils/handleError";
import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs").promises;
const formidable = require("formidable");

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

      const user = await User.findOne({ _id: uid });

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
          `/app/public/uploads/user/${uid}.${fields.name.split(".").at(-1)}`,
          await fs.readFile(files.file.filepath)
        );
        user.photoURL = `/uploads/user/${uid}.${fields.name.split(".").at(-1)}`
        await user.save();

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

export default withAuth(withDatabase(handler));

export const config = {
  api: {
    bodyParser: false,
  },
};
