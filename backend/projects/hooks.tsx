import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../firebase/firebase";
import { TProject } from "../types/dataTypes";
import {
  incrementUserPartDb,
  nextUserPartDb,
  previousUserPartDb,
} from "../user/hooks";
import { TUser } from "../types/authTypes";
import { getProjectPart } from "../learn/hooks";

export function useProjects() {
  const [projects, setProjects] = useState<TProject[] | undefined>(undefined);
  const [projectsLoading, setProjectsLoading] = useState(false);

  async function getProjects() {
    try {
      // Reference the "projects" collection
      const projectsCollection = collection(db, "projects");

      // Fetch all documents from the collection
      const querySnapshot = await getDocs(projectsCollection);

      // Process the results
      const projects: TProject[] = [];

      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() } as TProject);
      });

      setProjects(projects);

      return projects; // Returns an array of project objects
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }
  useEffect(() => {
    getProjects();
  }, []);

  return {
    projects,
    projectsLoading,
  };
}

export async function getProject(projectID: string) {
  try {
    // Reference the "projects" collection
    const docRef = doc(db, "projects", projectID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Project with ID ${projectID} does not exist.`);
    }
    const projectData = docSnap.data() as TProject;

    return { ...projectData } as TProject;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

export function useCurrentProject(user: TUser | undefined) {
  const [projectInfo, setProjectInfo] = useState<TProject | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProjectInfo = async () => {
      if (user && user.projectProgress) {
        setIsLoading(true);
        try {
          const project = await getProject(user.projectProgress.projectID);
          setProjectInfo(project);
        } catch (error) {
          console.error("Error fetching project info:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getProjectInfo();
  }, [user]);

  return { projectInfo, isLoading };
}
export function useLearnInteractions(
  user: TUser | undefined,
  handleProjectCompletion: Function,
  refetchUser: Function
) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content, setContent] = useState<string>("Loading content...");
  const [projectInfo, setProjectInfo] = useState<TProject | undefined>();

  console.log("use project part");
  const incrementFurthestAchievedPart = async () => {
    setIsTransitioning(true);
    if (user) {
      if (!user.projectProgress) {
        throw Error("No user project progress found");
      }

      if (!projectInfo) {
        throw Error("No project info found");
      }

      const setDocResult = await incrementUserPartDb(
        user,
        user.projectProgress.furthestPartAchieved
      );

      if (setDocResult.success) {
        if (
          user.projectProgress.furthestPartAchieved == projectInfo.totalParts
        ) {
          handleProjectCompletion();
        } else {
          await refetchUser();
        }
      }
    }
  };

  const nextViewedPart = async () => {
    setIsTransitioning(true);
    if (user) {
      if (!user.projectProgress) {
        throw Error("No user project progress found");
      }

      const setDocResult = await nextUserPartDb(
        user,
        user.projectProgress.currentPartViewed
      );

      if (setDocResult.success) {
        await refetchUser();
      }
    }
    console.log("next viewed part");
  };

  const previousViewedPart = async () => {
    setIsTransitioning(true);
    if (user) {
      if (!user.projectProgress) {
        throw Error("No user project progress found");
      }

      const setDocResult = await previousUserPartDb(
        user,
        user.projectProgress.currentPartViewed
      );

      if (setDocResult.success) {
        await refetchUser();
      }
    }
    console.log("previous viewed part");
  };

  useEffect(() => {
    const getContent = async () => {
      try {
        if (user && user.projectProgress) {
          const content = await getProjectPart(
            user.projectProgress.projectID,
            user.projectProgress.currentPartViewed
          );
          const projectInfo = await getProject(user.projectProgress.projectID);

          setContent(content);
          setProjectInfo(projectInfo);
          if (isTransitioning) {
            setIsTransitioning(false);
          }
          console.log("the content in question");
          console.log(content);
        }
      } catch (e) {
        console.log("error");
        console.log(e);
      }
    };

    if (user && user.projectProgress) {
      getContent();
    }
  }, [user]);

  return {
    projectInfo,
    content,
    isTransitioning,
    incrementFurthestAchievedPart,
    nextViewedPart,
    previousViewedPart,
  };
}
