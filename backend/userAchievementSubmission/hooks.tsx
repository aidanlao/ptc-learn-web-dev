import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../firebase/firebase";
import {
  TFileSubmission,
  TFileSubmissionResult,
  TUserSubmission,
} from "../types/dataTypes";

export async function submitAchievementListToFirebase(
  fileSubmissionList: TFileSubmission[]
): Promise<TFileSubmissionResult> {
  try {
    // Get all new achievement IDs from the submission list
    const newAchievementIds = fileSubmissionList.map(
      (submission) => submission.achievementID
    );

    // Get the user from the first submission (assuming all submissions are for the same user)
    const user = fileSubmissionList[0]?.user;

    if (!user) {
      throw Error("No user found in submissions");
    }

    // Update user's achievements completed first
    const userDocRef = doc(db, "users", user.id);

    await setDoc(
      userDocRef,
      {
        achievementsCompleted: [
          ...(user.achievementsCompleted || []),
          ...newAchievementIds,
        ],
      },
      { merge: true }
    );
    for (const fileSubmission of fileSubmissionList) {
      if (!fileSubmission.user.projectProgress) {
        throw Error("No project progress found");
      }

      const projectID = fileSubmission.user.projectProgress.projectID;
      const part = fileSubmission.partNum;
      const submissionID =
        user.id +
        "-" +
        -projectID +
        "-" +
        part.toString() +
        "-" +
        fileSubmission.achievementID;

      let fileDataToAdd: TUserSubmission = {
        part: part,
        userID: user.id,
        projectID: projectID,
        isTextSubmission: fileSubmission.isTextSubmission,
        achievementID: fileSubmission.achievementID,
        submissionID: submissionID,
        approved: false,
        timestamp: new Date(),
      };

      if (
        fileSubmission.isTextSubmission &&
        typeof fileSubmission.submissionContent === "string"
      ) {
        fileDataToAdd.submissionContent = fileSubmission.submissionContent;
      } else if (fileSubmission.submissionContent instanceof File) {
        // If the submission content is a file, we need to upload it to Firebase Storage
        const fileToAdd = fileSubmission.submissionContent;
        // Upload to firebase storage
        const storageRef = ref(storage, submissionID);

        await uploadBytes(storageRef, fileToAdd);

        fileDataToAdd.fileName = fileToAdd.name;
        fileDataToAdd.fileType = fileToAdd.type;
      }

      // Upload to firestore db
      const docRef = doc(db, "submissions", submissionID);

      // Set the submission data in Firestore
      await setDoc(docRef, fileDataToAdd);
    }

    return {
      success: true,
    };
  } catch (e: any) {
    console.log("Submission failed");
    console.log(e);

    return {
      success: false,
      message: e.message,
    };
  }
}
