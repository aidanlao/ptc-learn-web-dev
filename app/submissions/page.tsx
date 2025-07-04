"use client";
import { useContext, useEffect } from "react";
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem } from "@heroui/accordion";

import { AuthContext } from "@/providers/authContext";
import { useUserSubmissions } from "@/backend/submissionViewer/functions";
import { SubmitSubmissionButton } from "@/components/submitSubmissionButton";
/* eslint-disable jsx-a11y/label-has-associated-control */
export default function UserSubmissions() {
  //const { register, handleSubmit } = useForm();
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const {
    users,
    userIDToUnapprovedSubmissionsMap,
    userIDToApprovedSubmissionsMap,
    achievements,
    loading,
  } = useUserSubmissions();

  useEffect(() => {
    if (user && !isLoading && !user.isAdmin) {
      router.push("/");
    }
  }, [user, isLoading]);

  return (
    <>
      {user && !isLoading && user.isAdmin && achievements ? (
        <div className="p-5">
          <h1 className="text-xl font-bold mb-5">User Submissions</h1>
          <Accordion>
            {users.map((user) => (
              <AccordionItem
                key={user.id}
                aria-label={`${user.name}'s submissions`}
                title={
                  <>
                    {user.name} -{" "}
                    {userIDToUnapprovedSubmissionsMap[user.id]?.length || 0}{" "}
                    unapproved
                  </>
                }
              >
                <div className="p-3">
                  {userIDToUnapprovedSubmissionsMap[user.id]?.length +
                    userIDToApprovedSubmissionsMap[user.id]?.length ===
                    0 ||
                  (!userIDToUnapprovedSubmissionsMap[user.id] &&
                    !userIDToApprovedSubmissionsMap[user.id]) ? (
                    <li className="mb-2">
                      {}
                      No submissions found for this user.
                    </li>
                  ) : (
                    <>
                      <ul className="mb-5">
                        <h1 className="font-bold text-xl py-2">Unapproved</h1>
                        {userIDToUnapprovedSubmissionsMap[user.id]?.map(
                          (submission) => (
                            <li
                              key={submission.submission.submissionID}
                              className="mb-2 border p-6 rounded-lg bg-gray-50"
                            >
                              <p className="font-bold">
                                {submission.submission.projectID}, part{" "}
                                {submission.submission.part}.<br />
                              </p>
                              <p className="font-bold">
                                {
                                  achievements[
                                    submission.submission.achievementID
                                  ].header
                                }
                              </p>
                              <p>
                                {
                                  achievements[
                                    submission.submission.achievementID
                                  ].desc
                                }{" "}
                                -{" "}
                                {
                                  achievements[
                                    submission.submission.achievementID
                                  ].pointsAwarded
                                }{" "}
                                points
                              </p>
                              <div className="my-5">
                                {submission.submissionFile && (
                                  <Image
                                    alt="Submission preview"
                                    className="max-h-96 w-100 rounded-lg"
                                    src={URL.createObjectURL(
                                      submission.submissionFile
                                    )}
                                  />
                                )}

                                <p className="font-bold mt-2">
                                  Text Submission:
                                </p>
                                {submission.submission.submissionContent && (
                                  <p className="">
                                    {submission.submission.submissionContent}
                                  </p>
                                )}
                              </div>

                              <span className="text-tiny ">
                                {submission.submission.submissionID}
                              </span>
                              <SubmitSubmissionButton
                                pointsAwarded={
                                  achievements[
                                    submission.submission.achievementID
                                  ].pointsAwarded
                                }
                                submissionID={
                                  submission.submission.submissionID
                                }
                                userID={user.id}
                              />
                            </li>
                          )
                        )}
                      </ul>
                      <hr className="my-10 border-gray-300" />
                      <ul>
                        <h1 className="font-bold text-xl py-2">Approved</h1>
                        {userIDToApprovedSubmissionsMap[user.id]?.map(
                          (submission) => (
                            <li
                              key={submission.submissionID}
                              className="mb-2 border p-6 rounded-lg bg-gray-50"
                            >
                              <p className="font-bold">
                                {submission.projectID}, part {submission.part}.
                                <br />
                                <span className="text-tiny">
                                  {submission.submissionID}
                                </span>
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <>
          <p className="p-5">Loading...</p>
        </>
      )}
    </>
  );
}
