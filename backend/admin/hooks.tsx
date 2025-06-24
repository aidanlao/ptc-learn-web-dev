import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { TAchievement, TAdminFileUpload, TPart } from "../types/dataTypes";
import { db, storage } from "../firebase/firebase";

export async function addAchievements(achievementList: TAchievement[]) {
  try {
    const promises = achievementList.map((achievement) =>
      setDoc(doc(db, "achievements", achievement.id), achievement)
    );

    await Promise.all(promises);

    return {
      success: true,
      message: "Achievements added successfully",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "An error occurred while adding achievements",
    };
  }
}
export async function addPart(data: TAdminFileUpload) {
  try {
    const fileMetadata: TPart = {
      fileID: data.fileID,
      releaseDate: data.releaseDate,
      projectID: data.projectID,
      part: data.part,
    };

    // Create a reference to the file you want to upload
    const storageID = data.projectID + "-" + data.fileID + ".md";
    const storageRef = ref(storage, storageID);

    console.log("here's the file i'm about to upload");
    console.log(data.file);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, data.file).then((snapshot: any) => {
      console.log("Uploaded a blob or file!");
    });

    await setDoc(doc(db, "parts", data.fileID), fileMetadata);

    return {
      success: true,
      message: "Part added successfully",
    };
    console.log("set doc successful");
    console.log(data);
  } catch (e: any) {
    return {
      success: false,
      message: e.message || "An error occurred while adding the part",
    };
  }
}
