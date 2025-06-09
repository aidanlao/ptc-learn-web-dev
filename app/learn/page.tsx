"use client";

import Markdown from "markdown-to-jsx";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { useContext } from "react";

import FinishPartModal from "@/components/finishPart";
import { useLearnInteractions } from "@/backend/projects/hooks";
import { AuthContext } from "@/providers/authContext";
import { setProjectAsCompletedDb } from "@/backend/user/dbFunctions";

export default function Learn() {
  const router = useRouter();
  const { refetchUser, user, isLoading, error } = useContext(AuthContext);

  console.log(useContext(AuthContext));
  const {
    content,
    projectInfo,
    isTransitioning,
    incrementFurthestAchievedPart,
    nextViewedPart,
    previousViewedPart,
  } = useLearnInteractions(user, handleProjectCompletion, refetchUser);

  if (isTransitioning) {
    return (
      <>
        <p>Loading part...</p>
      </>
    );
  }

  if (user && !user.projectProgress) {
    return (
      <>
        <p className="pb-5">
          You are not currently enrolled in a project! Go to projects page to
          choose one.
        </p>
        <Button
          onPress={() => {
            router.push("projects");
          }}
        >
          Choose a project
        </Button>
      </>
    );
  }

  return (
    <>
      {!isLoading && user && user.projectProgress && projectInfo ? (
        <>
          <div className="flex gap-5 justify-between items-center mb-5">
            {user.projectProgress.currentPartViewed > 1 && (
              <Button onPress={previousViewedPart}>Previous Part</Button>
            )}
            {user.projectProgress.currentPartViewed ==
            user.projectProgress.furthestPartAchieved ? (
              <FinishPartModal
                incrementFurthestAchievedPart={incrementFurthestAchievedPart}
                part={user.projectProgress.currentPartViewed}
                totalParts={projectInfo.totalParts}
                user={user}
              />
            ) : (
              <Button onPress={nextViewedPart}>Next Part</Button>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-xl font-bold">
              Part {user.projectProgress.currentPartViewed}
            </h1>
            <p className="text-lg">
              Progress: {user.projectProgress.furthestPartAchieved - 1} of{" "}
              {projectInfo.totalParts} parts completed
            </p>
            {error && (
              <p className="text-danger text-sm font-normal">
                Error loading project content. See console.
              </p>
            )}
          </div>

          <p className="text-danger text-sm font-light">{error?.message}</p>

          <div className="w-full h-full flex flex-col gap-5 ">
            {content ? (
              <Markdown className="markdown">{content}</Markdown>
            ) : (
              <>
                <p>Error: no content found</p>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <p>Loading user and project info...</p>
        </>
      )}
    </>
  );

  function handleProjectCompletion() {
    if (user && projectInfo) {
      setProjectAsCompletedDb(user, projectInfo.id);
      router.push("/projectcomplete");
      console.log("Project completed, setting in db");
    } else {
      console.error("User or project info not found for completion");
    }
  }
}
