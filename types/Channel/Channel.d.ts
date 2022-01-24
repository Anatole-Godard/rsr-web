import { User } from "@definitions/User";
import { Message } from "@definitions/Message";
import { Resource } from "@definitions/Resource/Resource";

export type Channel = {
  id: number;
  owner: User;
  name: string;
  messages: Message[];
  activities: any[]; //TODO: define
  users: User[];
  createdAt: Date | string;
  resources: Resource[];
  image?: any;
  description?: string;
};
