import withDatabase from "@middleware/mongoose";
import Resource from "@models/Resource";
import { handleError } from "@utils/handleError";
import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs").promises;
const fs_old = require("fs");
const formidable = require("formidable");

async function isFolder(path: any) {
  const result = await fs.stat(path).catch((err: { code: string }) => {
    if (err.code === "ENOENT") {
      return false;
    }
    throw err;
  });

  return !result ? result : result.isDirectory();
}

function checkFileExists(filepath: any) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs_old.constants.F_OK, (error: any) => {
      resolve(!error);
    });
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
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

      const resource = await Resource.findOne({ slug });

      if (!resource) {
        res.status(404).json({
          data: null,
          error: {
            code: 404,
            message: "not found",
          },
        });
        return;
      }

      if (
        resource.data.type !== "external_link" &&
        resource.data.type !== "physical_item"
      ) {
        res.status(400).json({
          data: null,
          error: {
            code: 400,
            message: "bad request",
            fields: {
              type: resource.data.type,
            },
          },
        });
        return;
      }

      try {
        //debug purposes only
        // list of files in tmp uploads folder
        //         const filesUpload = await fs.readdir("/tmp");
        //         console.log(filesUpload, files.file.filepath);
        // return;

        // await fs.rename(
        //   files.file.filepath,
        //   `/uploads/${resource.slug}.${fields.name.split(".").at(-1)}`
        // );
        // if (!(await isFolder("/uploads"))) {
        //   await fs.mkdir("/uploads");
        // }

        // if (
        //   await checkFileExists(
        //     `/uploads/${resource.slug}.${fields.name.split(".").at(-1)}`
        //   )
        // ) {
        //   await fs.unlink(
        //     `/uploads/${resource.slug}.${fields.name.split(".").at(-1)}`
        //   );
        // }

        
        await fs.writeFile(
          `/uploads/${resource.slug}.${fields.name.split(".").at(-1)}`,
          await fs.readFile(files.file.filepath)
        );
        resource.photoURL = {
          ...fields,
          url: `/uploads/${resource.slug}.${fields.name.split(".").at(-1)}`,
        };
        await resource.save();

        res.status(200).json({
          data: {
            attributes: resource,
          },
          error: null,
        });
      } catch (err) {
        handleError(res, err, "resource/upload");
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
