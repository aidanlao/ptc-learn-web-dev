import { doc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";
import { TUser } from "../types/authTypes";
import { TSetDocResult } from "../types/dataTypes";

export async function setUserPart(
  user: TUser,
  part: number
): Promise<TSetDocResult> {
  try {
    const docRef = doc(db, "users", user.id);

    await updateDoc(docRef, {
      "projectProgress.part": part,
    });

    console.log("success");

    return {
      success: true,
    };
  } catch (e: any) {
    console.log(e);

    return {
      success: false,
      message: e.message,
    };
  }
}

export async function completeProject(user: TUser): Promise<TSetDocResult> {
  try {
    const docRef = doc(db, "users", user.id);

    if (!user.projectProgress) {
      throw Error("No project progress found");
    }

    await updateDoc(docRef, {
      projectProgress: undefined,
      projectHistory: {
        projectCompleted: user.projectProgress.projectID,
        dateCompleted: new Date(),
      },
    });

    console.log("successfully completed project");

    return {
      success: true,
    };
  } catch (e: any) {
    console.log(e);

    return {
      success: false,
      message: e.message,
    };
  }
}
