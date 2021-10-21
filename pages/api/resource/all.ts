import type { NextApiRequest, NextApiResponse } from "next";
import type { ResourceResponse } from "@definitions/Resource/ResourceResponse";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResourceResponse>
) {
  try {
    res.status(200).json({
      data: {
        id: "all",
        type: "resource",
        attributes: [
          {
            id: 1,
            owner: "John Doe",
            description: "This is my first resource",
            slug: "my-first-resource",
            createdAt: new Date("2020-01-01T00:00:00.000Z"),
            data: {
              type: "location",
              attributes: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [125.6, 10.1],
                },
                properties: {
                  name: "Dinagat Islands",
                },
              },
            },
            likes: 12,
            comments: [
              {
                owner: "John Doe",
                content: "This is my first comment",
                photoUrl: "https://placekitten.com/300/300",
              },
            ],
            validated: true,
          },
          {
            id: 2,
            owner: "Leonard Eau",
            description: "This is my second resource",
            slug: "my-second-resource",
            createdAt: new Date("2020-01-01T00:00:00.000Z"),
            data: {
              type: "physical-item",
              attributes: {
                name: "A bottle of water",
                description: "A bottle of water",
                photoUrl: "https://placekitten.com/300/300",
                price: null,
                category: "Water",
              },
            },
            likes: 12,
            comments: [
              {
                owner: "John Doe",
                content: "This is my first comment",
                photoUrl: "https://placekitten.com/300/300",
              },
            ],
            validated: true,
          },
        ],
      },
    });
  } catch (err) {
    res.status(500).json({
      error: {
        code: 500,
        message:
          err instanceof Error
            ? err.message
            : "an error occured on resource:all",
      },
    });
  }
}
