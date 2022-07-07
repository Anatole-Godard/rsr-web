import withDatabase from "@middleware/mongoose";
import Channel from "@models/Channel";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

import { promises as fs } from "fs";

const DEFAULT_PATH = `/usr/src/app/public/uploads/channel`;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const form = new formidable.IncomingForm();

  if (req.method === "POST") {
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

        if (!slug) {
          res.status(400).json({
            data: null,
            error: {
              code: 400,
              message: "bad request",
              fields: { slug },
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

        const channel = await Channel.findOne({ slug });

        if (!channel) {
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
            `${DEFAULT_PATH}/${channel.slug}.${fields.name.split(".").at(-1)}`,
            await fs.readFile(files.file.filepath)
          );
          channel.image = {
            ...fields,
            url: `/uploads/channel/${channel.slug}.${fields.name
              .split(".")
              .at(-1)}`,
          };
          await channel.save();

          res.status(200).json({
            data: {
              attributes: channel,
            },
            error: null,
          });
        } catch (err) {
          // @ts-ignore
          handleError(res, err, "channel/upload");
        }
      }
    );
  }

  if (req.method === "DELETE") {
    const channel = await Channel.findOne({ slug });

    if (!channel) {
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
      await fs.unlink(
        `${DEFAULT_PATH}/${channel.slug}.${channel.image.name
          .split(".")
          .at(-1)}`
      );
      channel.image = null;
      await channel.save();

      res.status(200).json({
        data: {
          attributes: channel,
        },
        error: null,
      });
    } catch (err) {
      // @ts-ignore
      handleError(res, err, "channel/upload");
    }
  }
}

export default withDatabase(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
