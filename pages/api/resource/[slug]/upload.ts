import withDatabase from "@middleware/mongoose";
import formidable from "formidable";
import Resource from "@models/Resource";
import { handleError } from "libs/handleError";
import { ResourceType, types } from "constants/resourcesTypes";
import { NextApiRequest, NextApiResponse } from "next";

import { promises as fs } from "fs";

const DEFAULT_PATH = `/usr/src/app/public/uploads/resource`;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string };
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
            message: err.message
          }
        });
        return;
      }

      if (!slug) {
        res.status(400).json({
          data: null,
          error: {
            code: 400,
            message: "bad request",
            fields: { slug }
          }
        });
        return;
      }

      if (req.method !== "POST") {
        res.status(405).json({
          data: null,
          error: {
            code: 405,
            message: "method not allowed"
          }
        });
        return;
      }

      const resource = await Resource.findOne({ slug });

      if (!resource) {
        res.status(404).json({
          data: null,
          error: {
            code: 404,
            message: "not found"
          }
        });
        return;
      }

      if (
        types.find(
          (type: ResourceType) => type.value === resource.data.type
        ) === undefined ||
        !types.find((type: ResourceType) => type.value === resource.data.type)
          .hasMedia
      ) {
        res.status(400).json({
          data: null,
          error: {
            code: 400,
            message: "bad request",
            fields: {
              type: resource.data.type
            }
          }
        });
        return;
      }

      try {
        await fs.mkdir(`${DEFAULT_PATH}/${slug}`, {
          recursive: true
        });

        await fs.writeFile(
          `${DEFAULT_PATH}/${slug}/${fields.name}`,
          await fs.readFile(files.file.filepath)
        );
        resource.data.attributes.properties.medias.push({
          ...fields,
          url: `/uploads/resource/${resource.slug}/${fields.name}`
        });

        resource.markModified("data.attributes.properties.medias");

        await resource.save();

        res.status(200).json({
          data: {
            attributes: resource
          },
          error: null
        });
      } catch (err) {
        // @ts-ignore
        handleError(res, err, "resource/upload");
      }
    }
  );
}

export default withDatabase(handler);

export const config = {
  api: {
    bodyParser: false
  }
};
