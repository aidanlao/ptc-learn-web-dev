"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { useContext } from "react";
import { AuthContext } from "@/providers/authContext";

export default function Home() {
  const { isLoading, user } = useContext(AuthContext);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Learn by&nbsp;</span>
        <span className={title({ color: "violet" })}>building&nbsp;</span>
        <br />
        <span className={title()}>real projects.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Explore hands-on coding challenges and real-world projects to grow
          your skills.
        </div>
      </div>

      <div className="flex gap-3">
        {!isLoading && user ? (
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/projects"
          >
            Explore Projects
          </Link>
        ) : (
          <>
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href="/login"
            >
              Login
            </Link>
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href="/register"
            >
              Register
            </Link>
          </>
        )}
      </div>

      <div className="mt-2">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>Start your journey by exploring projects</span>
        </Snippet>
      </div>
    </section>
  );
}
