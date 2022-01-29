import { ChannelMinimum } from "./Channel";
import { ResourceMinimum } from "./Resource";
import { UserMinimum } from "./User";

export type Notification = {
  user: UserMinimum;
  document: ResourceMinimum | ChannelMinimum;
  type:
    | "comment"
    | "mention"
    | "like"
    | "message"
    | "resource_create"
    | "invite";
  createdAt: Date | string;
};
