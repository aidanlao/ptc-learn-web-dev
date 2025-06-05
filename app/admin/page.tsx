"use client";
import { Button } from "@nextui-org/button";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";

import { addPart } from "@/backend/admin/hooks";
import { AuthContext } from "@/providers/authContext";
import { useRouter } from "next/navigation";
/* eslint-disable jsx-a11y/label-has-associated-control */
export default function Admin() {
  const { register, handleSubmit } = useForm();
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  function handleFileUpload(data: any) {
    console.log("handl efile upload");
    console.log(data.file[0]);
    const file = data.file[0];

    addPart({ ...data, part: parseInt(data.part), file: file });
  }

  useEffect(() => {
    if (user && !isLoading && !user.isAdmin) {
      router.push("/");
    }
  }, [user, isLoading]);

  return (
    <>
      {user && !isLoading && user.isAdmin ? (
        <>
          <div className="h-full w-full flex flex-col gap-5 justify-center">
            <h1 className="text-4xl font-bold">Upload markdown files</h1>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit((data) => {
                handleFileUpload(data);
              })}
            >
              <label>FileID</label>
              <input
                className="px-5 py-3 rounded-lg border-2"
                placeholder="FileID"
                type="text"
                {...register("fileID")}
              />
              <label>ProjectID</label>
              <input
                className="px-5 py-3 rounded-lg border-2"
                placeholder="ProjectID"
                type="text"
                {...register("projectID")}
              />
              <label>Part</label>
              <input
                className="px-5 py-3 rounded-lg border-2"
                type="number"
                {...register("part")}
              />
              <label className="file-upload-label" htmlFor="file-upload">
                <span>Markdown file</span>
                <input
                  required
                  accept="text/markdown"
                  className="file-upload-input"
                  id="file-upload"
                  type="file"
                  {...register("file")}
                />
              </label>
              <Button className="py-2 px-5" type="submit">
                Submit
              </Button>
            </form>
          </div>
          ;
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
    </>
  );
}
