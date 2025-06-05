"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";

import { useCurrentProject } from "@/backend/projects/hooks";
import { AuthContext } from "@/providers/authContext";

const ProjectCompletePage = () => {
  const { refetchUser, user, isLoading, error } = useContext(AuthContext);
  const { projectInfo, isLoading: isProjectLoading } = useCurrentProject(user);
  const project = projectInfo || { name: "Unknown Project" }; // Fallback in case projectInfo is undefined
  const router = useRouter();
  console.log("rerender");
  const handleGoToProjects = () => {
    router.push("/projects");
  };

  if (isLoading || isProjectLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Congratulations!</h1>
      <p className="text-lg">
        You have successfully completed the project:{" "}
        <strong className="font-semibold">{project.name}</strong>
      </p>
      <button
        className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleGoToProjects}
      >
        Pick a New Project
      </button>
    </div>
  );
};

export default ProjectCompletePage;
