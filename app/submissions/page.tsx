"use client";
import { Button } from "@nextui-org/button";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { Image } from "@nextui-org/image";
import { addPart } from "@/backend/admin/hooks";
import { AuthContext } from "@/providers/authContext";
import { useRouter } from "next/navigation";
import { useUserSubmissions } from "@/backend/userSubmission/functions";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
/* eslint-disable jsx-a11y/label-has-associated-control */
export default function UserSubmissions() {
  //const { register, handleSubmit } = useForm();
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const {
    users,
    userIDToUnapprovedSubmissionsMap,
    userIDToApprovedSubmissionsMap,
    loading,
  } = useUserSubmissions();

  useEffect(() => {
    if (user && !isLoading && !user.isAdmin) {
      router.push("/");
    }
  }, [user, isLoading]);

  return (
    <>
      {user && !isLoading && user.isAdmin ? (
        <>
          <h1 className="text-xl font-bold mb-5">User Submissions</h1>
          <Accordion>
            {users.map((user) => (
              <AccordionItem
                key={user.id}
                aria-label={`${user.name}'s submissions`}
                title={user.name}
              >
                <div className="p-3">
                  {(userIDToUnapprovedSubmissionsMap[user.id]?.length +
                    userIDToApprovedSubmissionsMap[user.id]?.length ===
                    0 ||
                    (!userIDToUnapprovedSubmissionsMap[user.id] &&
                      !userIDToApprovedSubmissionsMap[user.id])) && (
                    <li className="mb-2">
                      {}
                      No submissions found for this user.
                    </li>
                  )}

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
                            {submission.submission.part}.<br></br>
                          </p>
                          {submission.submissionFile && (
                            <Image
                              className="max-h-96 w-100 rounded-lg"
                              src={URL.createObjectURL(
                                submission.submissionFile
                              )}
                              alt="Submission preview"
                            />
                          )}
                          <span className="text-tiny">
                            {submission.submission.submissionID}
                          </span>
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
                            <br></br>
                            <span className="text-tiny">
                              {submission.submissionID}
                            </span>
                          </p>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
    </>
  );
}
