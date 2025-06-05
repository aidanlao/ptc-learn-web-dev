"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useContext, useEffect, useState } from "react";

import { useProjects } from "@/backend/projects/hooks";
import { TProject } from "@/backend/types/dataTypes";
import { setProject } from "@/backend/user/hooks";
import { AuthContext } from "@/providers/authContext";
export default function Projects() {
  const { projects, projectsLoading } = useProjects();
  const { isLoading: userLoading, user, refetchUser } = useContext(AuthContext);
  const [currentProject, setCurrentProject] = useState<TProject | null>(null);

  useEffect(() => {
    if (projects) {
      const projectProgress = user?.projectProgress;
      const foundProject =
        projects?.find(
          (project) => projectProgress?.projectID === project.id
        ) || null;

      if (foundProject) setCurrentProject(foundProject);
    }
  }, [user, projects]);

  const selectProject = async (id: string) => {
    console.log("select " + id);
    if (!userLoading && user) {
      const result = await setProject(user, id);

      if (result.success) refetchUser();
      console.log(result);
      const foundProject =
        projects?.find((project) => project.id === id) || null;

      setCurrentProject(foundProject);
    } else {
      console.log("failed to select project, user undefined");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-3">
        <h1 className="text-3xl font-bold py-5">Projects</h1>

        <Card isPressable className="p-2 clickableCard cursor-pointer">
          {currentProject ? (
            <>
              <CardHeader className="pb-0 flex-col items-start">
                <h4 className="text-large uppercase font-bold">
                  {currentProject.id}
                </h4>
                <span className="text-default-500 text-small normal-case font-light">
                  Current Project
                </span>
                <hr className="text-black w-full" />
              </CardHeader>
              <CardBody className="overflow-visible py-4">
                <small className="text-default-500">Description</small>
              </CardBody>
            </>
          ) : (
            <p>No project selected.</p>
          )}
        </Card>
        <h2 className="text-2xl font-bold py-1">Choose a project below!</h2>

        <p />
        {projectsLoading || !projects ? (
          <>
            <p>Projects loading...</p>
          </>
        ) : (
          <>
            {projects.map((project: TProject) => {
              return (
                <>
                  <Card
                    isPressable
                    className="p-2  clickableCard cursor-pointer"
                    onPress={() => {
                      console.log("press");
                      selectProject(project.id);
                    }}
                  >
                    <CardHeader className="pb-0 flex-col items-start">
                      {" "}
                      <h4 className="text-large uppercase font-bold">
                        {project.name}
                      </h4>
                      <hr className="text-black w-full" />
                    </CardHeader>
                    <CardBody className="overflow-visible py-4">
                      <small className="text-default-500">Description</small>
                      <h4 className="font-bold text-large">TBA</h4>
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src="https://media.licdn.com/dms/image/D4D12AQF6mW4EuB-99Q/article-cover_image-shrink_720_1280/0/1692951785182?e=2147483647&v=beta&t=I6_1-aBTAg0fihJHret-C4hRNuffBu8JyrqKfXsm74w"
                        width={270}
                      />
                    </CardBody>
                  </Card>
                </>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
