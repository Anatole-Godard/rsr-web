import type {NextApiRequest, NextApiResponse} from "next";
import {fakeUser} from "@utils/faker.dev";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const user = {
            email: "t&t.t",
            fullName: "T&T",
            birthDate: "2020-01-01",
            role: "admin",
            createdAt: new Date("2020-01-01"),
            photoURL:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F624181609716098984%2F&psig=AOvVaw2_X_Z_X_Z_X_X_X_X_X&ust=1588180984523000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKDyq-_X-oCFQAAAAAdAAAAABAD",
        };
        return res.status(200).json({
            user
        });
    } catch (err) {

    }
}