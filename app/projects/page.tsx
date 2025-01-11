"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import { useProjects } from "@/backend/projects/hooks";
import { TProject } from "@/backend/types/dataTypes";

export default function Projects() {
  const { projects, projectsLoading } = useProjects();

  return (
    <>
      <div className="w-full h-full flex flex-col gap-3">
        <h1 className="text-3xl font-bold pb-5">Choose a project below!</h1>
        <p></p>
        {projectsLoading || !projects ? (
          3(
            <>
              <p>Projects loading...</p>
            </>
          )
        ) : (
          <>
            {projects.map((projqect: TProject) => {
              return (
                <>
                  <Card className="py-4  clickableCard cursor-pointer">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <p className="text-tiny uppercase font-bold">
                        {project.name}
                      </p>
                      <small className="text-default-500">Description</small>
                      <h4 className="font-bold text-large">TBA</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
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
