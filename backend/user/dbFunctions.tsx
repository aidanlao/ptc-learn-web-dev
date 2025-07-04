import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";
import { TUser } from "../types/authTypes";
import { TProjectProgress, TSetDocResult } from "../types/dataTypes";
import { useEffect, useState } from "react";

export async function setUserPartDb(
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

export async function setProjectAsCompletedDb(
  user: TUser,
  projectID: string
): Promise<TSetDocResult> {
  try {
    const docRef = doc(db, "users", user.id); // Reference to the user's document

    await updateDoc(docRef, {
      projectProgress: null,
      projectsCompleted: user.projectsCompleted
        ? [...user.projectsCompleted, projectID]
        : [projectID],
    });

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

export default async function incrementUserPartDb(
  user: TUser,
  currentPart: number
): Promise<TSetDocResult> {
  try {
    const docRef = doc(db, "users", user.id);
    const nextPart = currentPart + 1;

    await updateDoc(docRef, {
      "projectProgress.furthestPartAchieved": nextPart,
      "projectProgress.currentPartViewed": nextPart,
    });

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

export async function nextUserPartDb(
  user: TUser,
  currentPart: number
): Promise<TSetDocResult> {
  try {
    const docRef = doc(db, "users", user.id);
    const nextPart = currentPart + 1;

    await updateDoc(docRef, {
      "projectProgress.currentPartViewed": nextPart,
    });

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

export async function previousUserPartDb(
  user: TUser,
  currentPart: number
): Promise<TSetDocResult> {
  try {
    const docRef = doc(db, "users", user.id);
    const previousPart = currentPart - 1;

    if (previousPart < 1) {
      throw Error("Cannot go back to part 0");
    }
    await updateDoc(docRef, {
      "projectProgress.currentPartViewed": previousPart,
    });

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

export async function setProject(user: TUser, projectID: string) {
  try {
    const docRef = doc(db, "users", user.id);
    const projectProgress: TProjectProgress = {
      furthestPartAchieved: 1,
      currentPartViewed: 1,
      projectID: projectID,
    };

    await updateDoc(docRef, {
      projectProgress: projectProgress,
    });

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
export function useUsers() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const fetchedUsers: TUser[] = [];

        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() } as TUser);
        });

        setUsers(fetchedUsers);
        setError(null);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return { users, loading, error };
}
