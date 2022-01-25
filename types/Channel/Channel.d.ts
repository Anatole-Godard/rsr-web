import { User, UserMinimum } from "@definitions/User";
import { Message } from "@definitions/Message";
import { Resource } from "@definitions/Resource/Resource";

export type Channel = {
  owner: UserMinimum;
  name: string;
  slug: string;
  messages: Message[];
  activities: any[]; //TODO: define
  members: User[];
  createdAt: Date | string;
  image?: any;
  description?: string;
};
