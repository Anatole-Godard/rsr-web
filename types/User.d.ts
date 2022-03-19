import { Playlist } from "./Playlist";

export type User = {
  fullName: string;
  birthDate: Date | string;
  email: string;
  password?: string;
  role: "user" | "moderator" | "admin" | "superadmin";
  createdAt: Date;
  photoURL: string;
  uid: string;
  validated: boolean;
  playlists: Playlist;
};

export type UserMinimum = {
  fullName: string;
  photoURL: string;
  uid: string;
};


