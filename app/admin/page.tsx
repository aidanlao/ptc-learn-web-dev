"use client";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import AchievementInput from "./AchievementInput";

import { addAchievements, addPart } from "@/backend/admin/hooks";
import { AuthContext } from "@/providers/authContext";
import { useProjects } from "@/backend/projects/hooks";
import { TAchievement } from "@/backend/types/dataTypes";
/* eslint-disable jsx-a11y/label-has-associated-control */
export default function Admin() {
  // Add these inside the Admin component
  const [achievements, setAchievements] = useState<
    { header: string; desc: string; pointsAwarded: number; required: boolean }[]
  >([{ header: "", desc: "", pointsAwarded: 0, required: true }]);
  const handleAchievementChange =
    (index: number) => (achievement: TAchievement) => {
      const newAchievements = [...achievements];

      newAchievements[index] = achievement;
      setAchievements(newAchievements);
    };

  const addAchievementInput = () => {
    setAchievements([
      ...achievements,
      { header: "", desc: "", pointsAwarded: 0, required: true },
    ]);
  };

  const removeAchievementInput = (index: number) => {
    const newAchievements = achievements.filter((_, i) => i !== index);

    setAchievements(newAchievements);
  };

  const { register, handleSubmit } = useForm();
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<string | null>();
  const { projects, projectsLoading } = useProjects();

  async function handleFileUpload(data: any) {
    console.log("handl efile upload");
    console.log(data.file[0]);
    const file = data.file[0];

    if (achievements.length > 0 && file != null && selectedProject) {
      const achievementsList = achievements.map((achievement) => {
        const achievementIDGenerated = crypto.randomUUID();

        return {
          ...achievement,
          id: achievementIDGenerated,
          projectID: selectedProject,
          part: parseInt(data.part),
        };
      });

      const achievementResponse = await addAchievements(achievementsList);

      if (!achievementResponse.success) {
        toast.error(achievementResponse.message);

        return;
      }

      const partResponse = await addPart({
        ...data,
        fileID: `${selectedProject}-${data.part}`,
        projectID: selectedProject,
        part: parseInt(data.part),
        file: file,
      });

      toast(achievementResponse.message);
      toast(partResponse.message);
    } else {
      console.log("file or achievements are not valid, aborting");

      return;
    }
  }

  useEffect(() => {
    if (user && !isLoading && !user.isAdmin) {
      router.push("/");
    }
  }, [user, isLoading]);

  return (
    <>
      {user && !isLoading && user.isAdmin && projects ? (
        <>
          <div className="p-5 h-full w-full flex flex-col gap-5 justify-center">
            <h1 className="text-4xl font-bold">Upload markdown files</h1>
            <p className="text-sm">
              Please note that submitting for a part that already exists results
              in that part being overwritten.
            </p>
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit((data) => {
                handleFileUpload(data);
              })}
            >
              <label className="text-2xl font-bold">Project</label>
              <Select
                className="max-w-xs"
                items={projects}
                label="Project Name"
                placeholder="Select a project"
                selectionMode="single"
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                }}
              >
                {(project) => <SelectItem>{project.name}</SelectItem>}
              </Select>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Achievements</h2>
                {achievements.map((_, index) => (
                  <div
                    key={index}
                    className="border shadow-md rounded p-5 flex justify-between items-start"
                  >
                    <AchievementInput
                      onAchievementChange={handleAchievementChange(index)}
                    />
                    <Button
                      className="mt-1"
                      type="button"
                      onClick={() => removeAchievementInput(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  className="w-fit"
                  type="button"
                  onClick={addAchievementInput}
                >
                  Add Achievement
                </Button>
              </div>
              <label className="text-2xl font-bold">Part Number</label>
              <input
                className="px-5 py-3 rounded-lg border-2"
                min="1"
                type="number"
                {...register("part", { min: 1 })}
              />
              <label
                className="file-upload-label flex flex-col gap-5"
                htmlFor="file-upload"
              >
                <span className="text-2xl font-bold">Markdown file</span>
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
            <ToastContainer position="bottom-right" />
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
