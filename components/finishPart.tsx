import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useForm } from "react-hook-form";
import clsx from "clsx";

import { TUser } from "@/backend/types/authTypes";
import { submitFileToFirebase } from "@/backend/adminSubmission/hooks";
import { TAchievement } from "@/backend/types/dataTypes";
import { useState } from "react";

export default function FinishPartModal({
  incrementFurthestAchievedPart,
  user,
  part,
  achievements,
  totalParts,
}: {
  incrementFurthestAchievedPart: Function;
  user: TUser;
  part: number;
  achievements: TAchievement[];
  totalParts: number;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const [submittedFiles, setSubmittedFiles] = useState<{ [key: number]: File }>(
    {}
  );
  const submitFile = async (data: any) => {
    if (data.file[0]) {
      console.log("handle file upload");
      console.log(data.file[0]);
      const file = data.file[0];

      const submissionResult = await submitFileToFirebase({
        user: user,
        file: file,
        partNum: part,
      });

      if (submissionResult.success) {
        incrementFurthestAchievedPart();
        onClose();
      } else {
        console.log("Error when submitting file to firebase");
        console.log(submissionResult.message);
      }
    } else {
      console.log("Make sure you are uploading a file");
    }
  };

  return (
    <>
      <div>
        <div className="mb-4 space-y-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="rounded-lg border text-white  backdrop-blur-sm p-4 shadow-sm"
            >
              <h3 className="text-lg font-medium">{achievement.header}</h3>
              <p className="text-sm ">{achievement.desc}</p>
              <div className="flex gap-2">
                {achievement.required && (
                  <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Required
                  </span>
                )}
                <span
                  className={clsx(
                    "mt-2  inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    {
                      "bg-green-100 text-green-800":
                        achievement.pointsAwarded <= 3,
                      "bg-yellow-100 text-yellow-800":
                        achievement.pointsAwarded <= 6 &&
                        achievement.pointsAwarded > 3,
                      "bg-red-100 text-red-800": achievement.pointsAwarded > 6,
                    }
                  )}
                >
                  {achievement.pointsAwarded} points
                </span>
              </div>

              <div className="mt-2">
                <input
                  type="file"
                  className="file-upload-input text-sm "
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSubmittedFiles({
                        ...submittedFiles,
                        [index]: e.target.files[0],
                      });
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <Button className="text-black bg-white/60" onPress={onOpen}>
          {user.projectProgress?.furthestPartAchieved == totalParts
            ? "Finish Project"
            : "Submit Work"}
        </Button>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <form onSubmit={handleSubmit(() => {})}>
                  <ModalHeader className="flex flex-col gap-1">
                    File Submission
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Submit a clear screenshot of your progress for this part.
                      Please take a picture of the compiled website if you can,
                      otherwise submit a picture of the code.
                    </p>
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit">
                      Submit File
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
