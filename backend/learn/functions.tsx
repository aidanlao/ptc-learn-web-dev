import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { db } from "../firebase/firebase";
import { TPart } from "../types/dataTypes";
import { TUser } from "../types/authTypes";

export async function getProjectPart(projectID: string, partNum: number) {
  console.log("trying to get part " + partNum + " from project" + projectID);
  const partsCollection = collection(db, "parts");
  const q = query(
    partsCollection,
    where("projectID", "==", projectID),
    where("part", "==", partNum)
  );
  const querySnapshot = await getDocs(q);

  const partDocs = querySnapshot.docs[0];
  const partData = partDocs ? (partDocs.data() as TPart) : undefined;

  if (partData) {
    const content = await getMarkdownContent(projectID, partData.fileID);

    return content;
  } else {
    throw Error(
      "Part data not found for " + projectID + ", partNum: " + partNum
    );
  }
}
export async function getMarkdownContent(
  projectID: string,
  fileID: string
): Promise<string> {
  const storageID = `${projectID}-${fileID}.md`; // Construct the file name

  console.log("storage id is " + storageID);
  const pathReference = ref(getStorage(), storageID); // Reference to the file in Firebase Storage

  console.log("storageID: " + storageID);

  // Get the download URL of the file
  const downloadURL = await getDownloadURL(pathReference);

  console.log("Download URL: " + downloadURL);

  // Fetch the file content using the download URL
  const response = await fetch(downloadURL);

  if (!response.ok) {
    throw new Error("Failed to fetch file content");
  }

  // Get the text content of the markdown file
  const text = await response.text();

  console.log("Fetched text content:", text);

  return text;
}
