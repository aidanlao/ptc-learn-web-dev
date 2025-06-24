import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../firebase/firebase";
import { TFileSubmission, TFileSubmissionResult } from "../types/dataTypes";

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
      const fileToAdd = fileSubmission.file;
      const submissionID =
        user.id +
        "-" +
        projectID +
        "-" +
        part.toString() +
        "-" +
        fileSubmission.achievementID;

      // Upload to firebase storage
      const storageRef = ref(storage, submissionID);
      await uploadBytes(storageRef, fileToAdd);

      // Upload to firestore db
      const docRef = doc(db, "submissions", submissionID);
      const fileDataToAdd = {
        part: part,
        userID: user.id,
        projectID: projectID,
        achievementID: fileSubmission.achievementID,
        submissionID: submissionID,
        approved: false,
        fileName: fileToAdd.name,
        fileType: fileToAdd.type,
        timestamp: new Date(),
      };

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
