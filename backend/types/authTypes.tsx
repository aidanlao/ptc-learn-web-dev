import { TProjectProgress } from "./dataTypes";

export type TUser = {
  id: string;
  name: string;
  email: string;
  dateCreated: Date;
  level: number;
  projectProgress: TProjectProgress | null;
  isAdmin: boolean;
};

export type TLoginDetails = {
  email: string;
  password: string;
  redirectTo: string;
};

// Define the type for the context
export type AuthContextType = {
  user: TUser | undefined;
  isLoading: boolean;
  error: Error | undefined;
  refetchUser: () => void;
};
