import { TProjectProgress } from "./dataTypes";

export type TUser = {
  id: string;
  name: string;
  email: string;
  dateCreated: Date;
  level: number;
  projectProgress: TProjectProgress;
};

export type TLoginDetails = {
  email: string;
  password: string;
  redirectTo: string;
};
