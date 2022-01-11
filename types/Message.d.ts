import {User, UserMinimum} from "@definitions/User";

export type Message = {
    user: UserMinimum;
    text: string;
    createdAt: Date | string;
}