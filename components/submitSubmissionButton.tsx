import { useState } from "react";

import { approveSubmission } from "../backend/userSubmission/functions";

interface SubmitSubmissionButtonProps {
  submissionID: string;
}

export const SubmitSubmissionButton = ({
  submissionID,
}: SubmitSubmissionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const success = await approveSubmission(submissionID);

      if (success) {
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
      {isLoading ? "Loading..." : isSubmitted ? "Submitted" : "Submit"}
    </button>
  );
};
