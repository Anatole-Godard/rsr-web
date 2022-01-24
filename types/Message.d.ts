import { UserMinimum } from "@definitions/User";
import { Resource } from "@definitions/Resource/Resource";

export type Message = {
  user: UserMinimum;
  data: {
    type: "message";
    text: string;
  };
  createdAt: string;
};
