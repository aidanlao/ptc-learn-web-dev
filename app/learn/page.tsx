"use client";

import Markdown from "markdown-to-jsx";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Accordion, AccordionItem } from "@heroui/accordion";

import FinishPartModal from "@/components/finishPart";
import { useLearnInteractions } from "@/backend/projects/hooks";
import { AuthContext } from "@/providers/authContext";
import { setProjectAsCompletedDb } from "@/backend/user/dbFunctions";

export default function Learn() {
  const router = useRouter();
  const { refetchUser, user, isLoading, error } = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  console.log(useContext(AuthContext));
  const {
    content,
    achievementList,
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
      <div className="p-5">
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
      </div>
    );
  }

  return (
    <>
      {!isLoading &&
      user &&
      user.projectProgress &&
      projectInfo &&
      achievementList ? (
        <>
          <div className="bg-gradient-to-r p-5 blue-bg-gradient min-h-1/2 rounded mb-4">
            <div className="flex flex-col items-center justify-center  text-white mt-5 gap-2 mb-8">
              <h1 className="text-xl  font-bold">
                Part {user.projectProgress.currentPartViewed}
              </h1>
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${((user.projectProgress.furthestPartAchieved - 1) / projectInfo.totalParts) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm">
                {user.projectProgress.furthestPartAchieved - 1} of{" "}
                {projectInfo.totalParts} parts completed
              </p>
              {error && (
                <p className="text-danger text-sm font-normal">
                  Error loading project content. See console.
                </p>
              )}
            </div>
            <div>
              {user.projectProgress.furthestPartAchieved ==
                user.projectProgress.currentPartViewed && (
                <>
                  <Accordion
                    className={`border shadow-lg p-5 border-gray-200 rounded-lg `}
                  >
                    <AccordionItem
                      key="one"
                      aria-label="Submission Instructions"
                      className="[&[data-open=false]]:opacity-50"
                      title={
                        <div className="flex flex-col ">
                          <h4 className="text-white text-large uppercase font-bold">
                            Submission Instructions
                          </h4>
                        </div>
                      }
                    >
                      <div className="flex flex-col gap-4 items-start">
                        <p className="text-default-500 text-white">
                          Submit a clear screenshot of your progress for this
                          part. Please take a picture of the compiled website if
                          you can, otherwise submit a picture of the code.
                        </p>
                        <FinishPartModal
                          incrementFurthestAchievedPart={
                            incrementFurthestAchievedPart
                          }
                          part={user.projectProgress.currentPartViewed}
                          achievements={achievementList}
                          totalParts={projectInfo.totalParts}
                          user={user}
                        />
                      </div>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
            </div>
          </div>
          <div className="flex p-5 gap-5 justify-between items-center ">
            {user.projectProgress.currentPartViewed > 1 ? (
              <Button onPress={previousViewedPart}>Previous Part</Button>
            ) : (
              <Button disabled className="disabled">
                Previous Part
              </Button>
            )}
            {user.projectProgress.currentPartViewed ==
            user.projectProgress.furthestPartAchieved ? (
              <>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader>Submit your work first</ModalHeader>
                        <ModalBody>
                          To progress to the next part of the project, please
                          submit at least one achievement for this part. <br />
                          <br />
                          Open the submission instructions accordion at the top
                          or bottom of the page to submit.
                        </ModalBody>
                        <ModalFooter>
                          <Button onPress={onClose}>Ok</Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                <Button onPress={onOpen}>Next Part</Button>
              </>
            ) : (
              <Button onPress={nextViewedPart}>Next Part</Button>
            )}
          </div>

          <div className="w-full  p-5 h-full  flex justify-center ">
            {content ? (
              <Markdown className="markdown max-w-7xl">{content}</Markdown>
            ) : (
              <>
                <p>Error: no content found</p>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="p-5">Loading user and project info...</p>
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
