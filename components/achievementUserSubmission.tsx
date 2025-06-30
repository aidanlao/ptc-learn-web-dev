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
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import { submitAchievementListToFirebase } from "@/backend/adminSubmission/hooks";
import { TAchievement } from "@/backend/types/dataTypes";
import { AuthContext } from "@/providers/authContext";

export default function AchievementUserSubmission({
  achievements,
  totalParts,
}: {
  achievements: TAchievement[];
  totalParts: number;
}) {
  const { refetchUser, setUser, user, isLoading, error } =
    useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const [submittedContent, setSubmittedContent] = useState<{
    [key: number]: File | string;
  }>({});
  const submitContent = async () => {
    if (!user || user == null || !user.projectProgress) return;
    if (Object.keys(submittedContent).length === 0) {
      console.log("No files submitted");
      toast.error("Please submit at least one file for your achievements");

      return;
    }

    const invalidFiles = Object.values(submittedContent).some(
      (submission) =>
        submission instanceof File &&
        !["image/png", "image/jpeg", "image/jpg"].includes(
          (submission as File).type
        )
    );

    if (invalidFiles) {
      toast.error("Please submit only PNG or JPG files");

      return;
    }
    const submissionList = [];

    for (let i = 0; i < achievements.length; i++) {
      if (submittedContent[i]) {
        submissionList.push({
          user: user,
          submissionContent: submittedContent[i],
          isTextSubmission: achievements[i].isTextAchievement,
          achievementID: achievements[i].id,
          partNum: user.projectProgress.currentPartViewed,
        });
      }
    }

    try {
      const results = await submitAchievementListToFirebase(submissionList);

      const allSuccessful = results.success;

      if (allSuccessful) {
        toast.success("Successfully submitted achievements!");
        setUser((prevUser) => ({
          ...prevUser!,
          achievementsCompleted: [
            ...prevUser!.achievementsCompleted,
            ...achievements
              .filter((_, i) => submittedContent[i])
              .map((achievement) => achievement.id),
          ],
        }));

        onClose();
      } else {
        toast.error("Error submitting one or more achievements");
        console.log("Submission errors:", results.message);
      }
    } catch (error) {
      toast.error("Error submitting achievements");
      console.error("Submission error:", error);
    }
  };

  if (isLoading || !user) {
    return <div>Loading user...</div>;
  }

  return (
    <>
      <div>
        <div className="mb-4 space-y-4">
          {achievements.map((achievement, index) =>
            user.achievementsCompleted.includes(achievement.id) ? (
              <>
                <div
                  key={index}
                  className="bg-green-900/30 opacity-80 rounded-lg border text-white  border-green-500/30  p-4 shadow-sm"
                >
                  <p>Completed</p>
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
                          "bg-red-100 text-red-800":
                            achievement.pointsAwarded > 6,
                        }
                      )}
                    >
                      {achievement.pointsAwarded} points
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                          "bg-red-100 text-red-800":
                            achievement.pointsAwarded > 6,
                        }
                      )}
                    >
                      {achievement.pointsAwarded} points
                    </span>
                  </div>

                  <div className="mt-2">
                    {achievement.isTextAchievement ? (
                      <input
                        className="w-full p-2 text-sm text-black rounded"
                        type="text"
                        placeholder="Enter your response"
                        onChange={(e) => {
                          setSubmittedContent((prevContent) => ({
                            ...prevContent,
                            [index]: e.target.value,
                          }));
                        }}
                      />
                    ) : (
                      <input
                        accept="image/*"
                        className="file-upload-input text-sm"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setSubmittedContent((prevFiles) => {
                            const newFiles = { ...prevFiles };
                            if (file) {
                              newFiles[index] = file;
                            } else {
                              delete newFiles[index];
                            }
                            return newFiles;
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            )
          )}
        </div>
        {achievements.some(
          (achievement, index) =>
            !user.achievementsCompleted.includes(achievement.id)
        ) && (
          // Only show the button if there are achievements that are not completed
          <Button className="text-black bg-white/60" onPress={onOpen}>
            Submit Work
          </Button>
        )}

        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <form
                  className="flex flex-col gap-4 p-6"
                  onSubmit={handleSubmit(submitContent)}
                >
                  <ModalHeader className="flex flex-col gap-1">
                    File Submission
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Submit a clear screenshot of your progress for the
                      achievements. You can only unlock new parts if you
                      complete all the required achievements for that part.
                    </p>
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit">
                      Submit File(s)
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
