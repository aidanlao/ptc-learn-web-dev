"use client";
import { Image } from "@heroui/image";
import { useContext, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { useRouter } from "next/navigation";

import ConfirmProjectChangeModal from "@/components/confirmProjectChangeModal";
import { useProjects } from "@/backend/projects/hooks";
import { TProject } from "@/backend/types/dataTypes";
import { setProject } from "@/backend/user/dbFunctions";
import { AuthContext } from "@/providers/authContext";
export default function Projects() {
  const { projects, projectsLoading } = useProjects();
  const { isLoading: userLoading, user, refetchUser } = useContext(AuthContext);
  const [currentProject, setCurrentProject] = useState<TProject | null>(null);
  const router = useRouter();

  if (user && !user?.isAdmin) {
    router.push("/");
  }
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

  const [isModalOpen, setModalOpen] = useState(false);
  const [pendingProjectID, setPendingProjectID] = useState<string | null>(null);

  const trySelectProject = (id: string) => {
    if (currentProject?.id == id) return;
    setPendingProjectID(id);
    setModalOpen(true);
  };

  const confirmProjectChange = () => {
    if (pendingProjectID) {
      selectProject(pendingProjectID);
      setPendingProjectID(null);
    }
    setModalOpen(false);
  };

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
      <div className="w-full h-full flex p-5 flex-col gap-3">
        <h1 className="text-3xl font-bold py-5 w-fit blueTextGradient">
          Projects
        </h1>

        {currentProject ? (
          <>
            <Accordion
              className={`border shadow-lg border-gray-200 rounded-lg `}
            >
              <AccordionItem
                key={currentProject.id}
                aria-label={currentProject.name}
                className="[&[data-open=false]]:opacity-50"
                title={
                  <div className="flex flex-col p-2">
                    <h4 className="text-large uppercase font-bold">
                      {currentProject.name}
                    </h4>
                    <span className="text-default-500 text-small normal-case font-light">
                      Current Project
                    </span>
                  </div>
                }
              >
                <div className="p-6 flex flex-row gap-4 items-start">
                  <div className="flex-1">
                    <p className="text-default-500">
                      {currentProject.description}
                    </p>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => router.push("/learn")}
                    >
                      Continue Project
                    </button>
                  </div>
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl w-64s h-40"
                    src={currentProject.imageAddress}
                  />
                </div>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <p>No project selected.</p>
        )}
        <h2 className="text-2xl font-bold py-1">Choose a project below!</h2>

        <p />
        {projectsLoading || !projects ? (
          <>
            <p>Projects loading...</p>
          </>
        ) : (
          <>
            {user?.projectsCompleted != undefined &&
              projects.map((project: TProject) => {
                return (
                  <>
                    {user?.projectsCompleted?.includes(project.id) ? (
                      <Accordion
                        className={`border border-blue-200 rounded-lg bg-blue-50 shadow-lg`}
                      >
                        <AccordionItem
                          key={project.id}
                          aria-label={project.name}
                          className="[&[data-open=false]]:opacity-50"
                          title={
                            <div className="flex flex-col p-2">
                              <h4 className="text-large uppercase font-bold">
                                {project.name}
                              </h4>
                              <span className="text-default-500 text-small normal-case font-light">
                                Completed Project
                              </span>
                            </div>
                          }
                        >
                          <div className="p-6 flex flex-row gap-4 items-start">
                            <div className="flex-1">
                              <p className="text-default-500">
                                {project.description}
                              </p>

                              {currentProject?.id === project.id ? (
                                <button
                                  disabled
                                  className="mt-4 px-4 py-2 bg-blue-500 disabled cursor-default opacity-50 text-white rounded-lg hover:bg-blue-600"
                                >
                                  Project Selected
                                </button>
                              ) : (
                                <button
                                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                  onClick={() => trySelectProject(project.id)}
                                >
                                  Select Project
                                </button>
                              )}
                            </div>
                            <Image
                              alt="Card background"
                              className="object-cover rounded-xl w-64s h-40"
                              src={project.imageAddress}
                            />
                          </div>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Accordion className="border shadow-lg border-gray-200 rounded-lg">
                        <AccordionItem
                          key={project.id}
                          aria-label={project.name}
                          title={
                            <div className="flex flex-col p-2">
                              <h4 className="text-large uppercase font-bold">
                                {project.name}
                              </h4>
                            </div>
                          }
                        >
                          <div className="p-6 flex flex-row gap-4 items-start">
                            <div className="flex-1">
                              <p className="text-default-500">
                                {project.description}
                              </p>
                              <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={() => trySelectProject(project.id)}
                              >
                                Select Project
                              </button>
                            </div>
                            <Image
                              alt="Card background"
                              className="object-cover rounded-xl w-64s h-40"
                              src={project.imageAddress}
                            />
                          </div>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </>
                );
              })}
          </>
        )}
      </div>
      <ConfirmProjectChangeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmProjectChange}
      />
    </>
  );
}
