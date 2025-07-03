import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getBlob, ref } from "firebase/storage";

import { db, storage } from "../firebase/firebase";
import { TUser } from "../types/authTypes";
import { TAchievement, TUserSubmission } from "../types/dataTypes";
import { P } from "framer-motion/dist/types.d-B_QPEvFK";
export const useUserSubmissions = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [userIDToApprovedSubmissionsMap, setUserIDToSubmissionsMap] = useState<
    Record<string, TUserSubmission[]>
  >({});
  const [
    userIDToUnapprovedSubmissionsMap,
    setUserIDToUnapprovedSubmissionsMap,
  ] = useState<
    Record<
      string,
      { submission: TUserSubmission; submissionFile: File | null }[]
    >
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [achievements, setAchievements] =
    useState<Record<string, TAchievement>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRef = collection(db, "users");
        const userSnapshot = await getDocs(usersRef);
        const usersData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TUser[];

        // Fetch achievements
        const achievementsRef = collection(db, "achievements");
        const achievementSnapshot = await getDocs(achievementsRef);
        const achievementsData = achievementSnapshot.docs.reduce(
          (acc, doc) => ({
            ...acc,
            [doc.id]: doc.data(),
          }),
          {}
        ) as Record<string, TAchievement>;

        setAchievements(achievementsData);

        // Fetch submissions
        const submissionsRef = collection(db, "submissions");
        const submissionSnapshot = await getDocs(submissionsRef);
        const { approvedSubmissionsData, unapprovedSubmissionsData } =
          await submissionSnapshot.docs.reduce(
            async (accPromise, doc) => {
              const acc = await accPromise;
              const submission = doc.data() as TUserSubmission;
              const userId = submission.userID;

              if (!acc.approvedSubmissionsData[userId]) {
                acc.approvedSubmissionsData[userId] = [];
              }
              if (!acc.unapprovedSubmissionsData[userId]) {
                acc.unapprovedSubmissionsData[userId] = [];
              }

              if (!submission.approved) {
                if (!submission.isTextSubmission) {
                  const fileRef = ref(storage, submission.submissionID);

                  try {
                    const fileBlob = await getBlob(fileRef);
                    const submissionFile = new File(
                      [fileBlob],
                      submission.submissionID,
                      { type: fileBlob.type }
                    );

                    acc.unapprovedSubmissionsData[userId].push({
                      submission,
                      submissionFile,
                    });
                  } catch (error) {
                    console.error("Error fetching file:", error);
                    acc.unapprovedSubmissionsData[userId].push({
                      submission,
                      submissionFile: null,
                    });
                  }
                } else {
                  acc.unapprovedSubmissionsData[userId].push({
                    submission,
                    submissionFile: null,
                  });
                }
              }

              if (submission.approved) {
                acc.approvedSubmissionsData[userId].push(submission);
              }

              return acc;
            },
            Promise.resolve({
              approvedSubmissionsData: {} as Record<string, TUserSubmission[]>,
              unapprovedSubmissionsData: {} as Record<
                string,
                { submission: TUserSubmission; submissionFile: File | null }[]
              >,
            })
          );

        setUserIDToSubmissionsMap(approvedSubmissionsData);
        setUserIDToUnapprovedSubmissionsMap(unapprovedSubmissionsData);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    users,
    achievements,
    userIDToUnapprovedSubmissionsMap,
    userIDToApprovedSubmissionsMap,
    loading,
    error,
  };
};
export const assignPointsToUser = async (userID: string, points: number) => {
  try {
    const userRef = doc(db, "users", userID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as TUser;
      const updatedPoints = (userData.points || 0) + points;

      await updateDoc(userRef, { points: updatedPoints });

      return true;
    } else {
      console.error("User not found");

      return false;
    }
  } catch (error) {
    console.error("Error assigning points to user:", error);
    throw error;
  }
};
export const approveSubmission = async (submissionID: string) => {
  try {
    const submissionsRef = collection(db, "submissions");
    const querySnapshot = await getDocs(submissionsRef);
    const submissionDoc = querySnapshot.docs.find(
      (doc) => (doc.data() as TUserSubmission).submissionID === submissionID
    );

    if (submissionDoc) {
      await updateDoc(submissionDoc.ref, { approved: true });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error approving submission:", error);
    throw error;
  }
};
