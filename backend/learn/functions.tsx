import { collection, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { db } from "../firebase/firebase";
import { TAchievement, TPart } from "../types/dataTypes";

export async function getProjectPart(projectID: string, partNum: number) {
  console.log("trying to get part " + partNum + " from project " + projectID);

  // Get part data
  const partsCollection = collection(db, "parts");
  const partQuery = query(
    partsCollection,
    where("projectID", "==", projectID),
    where("part", "==", partNum)
  );

  const partSnapshot = await getDocs(partQuery);
  const partDoc = partSnapshot.docs[0];
  const partData = partDoc ? (partDoc.data() as TPart) : undefined;

  if (!partData) {
    throw new Error("Part data not found");
  }

  // Get achievements
  const achievementsCollection = collection(db, "achievements");
  const achievementsQuery = query(
    achievementsCollection,
    where("projectID", "==", projectID),
    where("part", "==", partNum)
  );

  const achievementsSnapshot = await getDocs(achievementsQuery);
  const achievementList: TAchievement[] = achievementsSnapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
      }) as TAchievement
  );

  // Get content using partData.fileID
  const content = await getMarkdownContent(projectID, partData.fileID);

  return { achievementList, content };
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
