import { TUser } from "./authTypes";

export type TProjectProgress = {
  projectID: string;
  furthestPartAchieved: number;
  currentPartViewed: number;
};

export type TAdminFileUpload = {
  fileID: string;
  projectID: string;
  releaseDate: Date;
  part: number;
  file: File;
};

export type TPart = {
  fileID: string;
  releaseDate: Date;
  part: number;
  projectID: string;
};
export type TAchievement = {
  isTextAchievement: boolean;
  id: string;
  projectID: string;
  part: number;
  header: string;
  desc: string;
  pointsAwarded: number;
  required: boolean;
};

export type TFileSubmission = {
  user: TUser;
  submissionContent: File | string;
  achievementID: string;
  isTextSubmission: boolean;
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
  isTextSubmission: boolean;
  achievementID: string;
  userID: string;
  submissionContent?: string | null;
  timestamp: Date;
  fileName?: string | null;
  approved: boolean;
  fileType?: string | null;
};
