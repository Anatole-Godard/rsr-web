import { UserMinimum } from "./User";

export type LogBody = {
  method: string;
  location: string;
  user: UserMinimum;
  url: string;
  type: "fetch" | "next";
};

export type LogOptions = {
  method: "POST";
  headers: {
    "Content-Type": "application/json";
  };
  body: string;
};

export type Log = LogBody & {
  createdAt: Date;
};
