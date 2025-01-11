import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebase";
import { TProject } from "../types/dataTypes";
import { useState } from "react";

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

  getProjects();

  return {
    projects,
    projectsLoading,
  };
}
