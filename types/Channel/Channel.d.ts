import {User} from "@definitions/User";
import {Message} from "@definitions/Message";
import {Resource} from "@definitions/Resource/Resource"

export type Channel = {
    id: number;
    owner: User;
    name: string;
    messages: Message[];
    users: User[];
    createdAt: Date | string;
    resources: Resource[];
    photoURL?: string;
}