export type User = {
  fullName: string;
  birthDate: Date | string;
  email: string;
  password?: string | undefined;
  role: string;
  createdAt: Date;
  photoURL: string;
};

export type UserMinimum = {
  fullName: string;
  photoURL: string;
};
