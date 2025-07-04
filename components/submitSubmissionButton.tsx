import { useState } from "react";

import {
  approveSubmission,
  assignPointsToUser,
} from "../backend/submissionViewer/functions";

interface SubmitSubmissionButtonProps {
  submissionID: string;
  userID: string;
  pointsAwarded: number;
}

export const SubmitSubmissionButton = ({
  userID,
  pointsAwarded,
  submissionID,
}: SubmitSubmissionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submissionApprovalSuccess = await approveSubmission(submissionID);
      const assignPointsSuccess = await assignPointsToUser(
        userID,
        pointsAwarded
      );

      if (submissionApprovalSuccess && assignPointsSuccess) {
        console.log("Submission approved and points assigned successfully.");
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300"
      disabled={isLoading || isSubmitted}
      onClick={handleSubmit}
    >
      {isLoading ? "Loading..." : isSubmitted ? "Approved" : "Approve"}
    </button>
  );
};
