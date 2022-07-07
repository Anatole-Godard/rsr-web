import { withAuth } from "@middleware/auth";
import withDatabase from "@middleware/mongoose";
import Tag from "@models/Tag";
import { handleError } from "libs/handleError";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid = undefined } = req.headers as { uid: string | undefined };

  try {
    const tags = await Tag.find({
      $or: [{ validated: true }, ...(uid && [{ "owner.uid": uid }])],
    }).select("-__v");

    res.status(200).json({
      data: { type: "resource", id: "tags", attributes: tags },
      error: null,
    });
  } catch (err) {
    // @ts-ignore
    handleError(res, err, "resource/tag");
  }
};

export default withAuth(withDatabase(handler));
