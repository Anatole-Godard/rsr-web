import type {NextApiRequest, NextApiResponse} from "next";
import {Message} from "@definitions/Message";
import {Channel} from "@definitions/Channel/Channel";
import Error from "next/error";
import {fakeMessage, faker, fakeResource, fakeUser} from "@utils/faker.dev";
import {ChannelResponse} from "@definitions/Channel/ChannelResponse";

export default function handler(req: NextApiRequest, res: NextApiResponse<ChannelResponse>) {
    try {
        const channel = {
            id: 1,
            owner: fakeUser(),
            name: "My first channel",
            messages: new Array(faker.datatype.number(5)).fill(null).map(() => fakeMessage()),
            users: new Array(faker.datatype.number(5)).fill(null).map(() => fakeUser()),
            createdAt: new Date("2020-01-01T00:00:00.000Z"),
            resources: new Array(faker.datatype.number(5)).fill(null).map(() => fakeResource())
        }
        return res.status(200).json({
            channel
        });
    } catch (err) {
        res.status(500).json({
            error: {
                code: 500,
                message:
                    err instanceof Error
                        ? err.message
                        : "an error occured on channel:all",
            },
        });
    }
}