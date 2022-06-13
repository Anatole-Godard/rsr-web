import type { NextApiRequest, NextApiResponse } from "next";
import Resource from "@models/Resource";
import withDatabase from "@middleware/mongoose";
import { handleError } from "libs/handleError";
import { withAuth } from "@middleware/auth";
import { getUser, isAdmin } from "libs/getCurrentUser";
import Tag from "@models/Tag";

import { promises as fs } from "fs";
const DEFAULT_PATH = `/usr/src/app/public/uploads/resource`;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.status(405).json({
      data: null,
      error: {
        code: 405,
        message: "method not allowed",
      },
    });
    return;
  }

  try {
    let resource = await Resource.findOne({
      slug: req.query.slug,
    }).lean();

    if (!resource) {
      res.status(404).json({
        data: null,
        error: {
          code: 404,
          message: "resource not found",
        },
      });
      return;
    }

    if (resource.owner.uid !== req.headers.uid) {
      if (!(await isAdmin(req, true))) {
        res.status(403).json({
          data: null,
          error: {
            code: 403,
            message: "forbidden",
          },
        });
        return;
      }
    }

    const user = await getUser(req);

    await Tag.bulkWrite(
      req.body.tags.map((t: string) => ({
        updateOne: {
          filter: { name: t },
          update: {
            name: t,
            owner: {
              uid: user._id.toString(),
              fullName: user.fullName,
              photoURL: user.photoURL,
            },
          },
          upsert: true,
        },
      }))
    );
    const tagsInDB = await Tag.find({ name: { $in: req.body.tags } }).select(
      "-__v"
    );

    resource = await Resource.findOneAndUpdate(
      { slug: req.query.slug },
      {
        ...req.body,

        tags: tagsInDB.map((t) => ({ ...t, _id: t._id.toString() })),
      }
    ).lean();

    // get files list in ressources folder if exists

    if (
      await fs.stat(`${DEFAULT_PATH}/${resource.slug}`).catch((err) => {
        if (err.code === "ENOENT") {
          return false;
        }
        throw err;
      })
    ) {
      const files = await fs.readdir(`${DEFAULT_PATH}/${resource.slug}`);
      // unlink files in ressources folder
      await Promise.all(
        files.map(async (file) => {
          await fs.unlink(`${DEFAULT_PATH}/${resource.slug}/${file}`);
        })
      );
    }

    res.status(200).json({
      data: {
        type: "resource",
        id: resource._id,
        attributes: await Resource.findOne({
          slug: req.query.slug,
        }).lean(),
        payload: {
          ...req.body,
        },
      },
    });
  } catch (err) {
    handleError(res, err, "resource:slug/edit");
  }
}

export default withAuth(withDatabase(handler));
