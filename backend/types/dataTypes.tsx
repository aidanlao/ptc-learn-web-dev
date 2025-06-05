import { TUser } from "./authTypes";

export type TProjectProgress = {
  projectID: string;
  furthestPartAchieved: number;
  currentPartViewed: number;
};

export type TAdminFileUpload = {
  fileID: string;
  projectID: string;
  part: number;
  file: File;
};

export type TPart = {
  fileID: string;
  part: number;
  projectID: string;
};

export type TFileSubmission = {
  user: TUser;
  file: File;
  partNum: number;
};

export type TFileSubmissionResult = {
  success: boolean;
  message?: string;
};

export type TSetDocResult = {
  success: boolean;
  message?: string;
};

export type TProject = {
  name: string;
  id: string;
  totalParts: number;
  completionMessage: string;
};
