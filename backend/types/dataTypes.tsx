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
  description: string;
  id: string;
  imageAddress: string;
  totalParts: number;
  completionMessage: string;
};

export type TUserSubmission = {
  part: number;
  projectID: string;
  submissionID: string;
  userID: string;
  timestamp: Date;
  fileName: string;
  approved: boolean;
  fileType: string;
};
