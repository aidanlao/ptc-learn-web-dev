import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { TAdminFileUpload } from "../types/dataTypes";
import { db, storage } from "../firebase/firebase";

export async function addPart(data: TAdminFileUpload) {
  try {
    const fileMetadata = {
      fileID: data.fileID,
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

    console.log("set doc successful");
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
