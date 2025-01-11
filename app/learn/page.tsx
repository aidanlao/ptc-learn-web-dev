"use client";

import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import NextLink from "next/link";
import { getProjectPart } from "@/backend/learn/hooks";
import { useAuth } from "@/backend/auth/authHooks";
import FinishPartModal from "@/components/finishPart";
import { setUserPart } from "@/backend/user/hooks";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";

export default function Learn() {
  const router = useRouter();
  const { refetchUser, user, isLoading, error } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content, setContent] = useState<string>("Loading content...");

  useEffect(() => {
    const getContent = async () => {
      try {
        if (user && user.projectProgress) {
          const content = await getProjectPart(
            user.projectProgress.projectID,
            user.projectProgress.part
          );

          setContent(content);

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

  const incrementPart = async () => {
    setIsTransitioning(true);
    if (user) {
      if (!user.projectProgress) {
        throw Error("No user project progress found");
      }

      const setDocResult = await setUserPart(
        user,
        user.projectProgress.part + 1
      );

      if (setDocResult.success) {
        if (user.projectProgress.part + 1 == user.projectProgress.totalParts) {
          handleProjectCompletion();
        } else {
          await refetchUser();
        }
      }
    }
  };

  if (isTransitioning) {
    return (
      <>
        <p>Moving you to the next part of the project...</p>
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
      {!isLoading && user && user.projectProgress ? (
        <>
          <FinishPartModal
            incrementPart={incrementPart}
            part={user.projectProgress.part}
            user={user}
          />
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
          <p>Loading user...</p>
        </>
      )}
    </>
  );

  function handleProjectCompletion() {
    setIsTransitioning(true);

    router.push("/projectcomplete");
  }
}
