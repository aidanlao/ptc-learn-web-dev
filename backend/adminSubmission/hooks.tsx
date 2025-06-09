import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../firebase/firebase";
import { TFileSubmission, TFileSubmissionResult } from "../types/dataTypes";

export async function submitFileToFirebase(
  fileSubmission: TFileSubmission
): Promise<TFileSubmissionResult> {
  try {
    if (!fileSubmission.user.projectProgress) {
      throw Error("No project progress found");
    }
    const projectID = fileSubmission.user.projectProgress.projectID;
    const part = fileSubmission.partNum;
    const user = fileSubmission.user;
    const fileToAdd = fileSubmission.file;
    const submissionID =
      user.id + "-" + projectID + "-" + part.toString() + "-" + fileToAdd.name;

    // Upload to firebase storages
    const storageRef = ref(storage, submissionID);

    uploadBytes(storageRef, fileToAdd).then((snapshot: any) => {
      console.log("Uploaded a blob or file!");
    });
    // Upload to firestore db
    const docRef = doc(db, "submissions", submissionID);
    const fileDataToAdd = {
      part: part,
      userID: user.id,
      projectID: projectID,
      submissionID: submissionID,
      approved: false,
      fileName: fileToAdd.name,
      fileType: fileToAdd.type,
      timestamp: new Date(),
    };

    await setDoc(docRef, fileDataToAdd);

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
