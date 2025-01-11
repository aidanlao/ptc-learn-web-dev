"use client";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import NextLink from "next/link";
import { useContext } from "react";

import { AuthContext } from "@/providers/authContext";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const { isLoading, user } = useContext(AuthContext);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent
        className={clsx(
          "basis-1/5 sm:basis-full transition duration-700",
          isLoading && "opacity-0"
        )}
        justify="start"
      >
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">PTC Learn Web Dev</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden sm:flex gap-4 justify-start ml-2">
          {!isLoading && user ? (
            <>
              <NavbarItem key="projects">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={"/projects"}
                >
                  Projects
                </NextLink>
              </NavbarItem>
              <NavbarItem key="learn">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={"/learn"}
                >
                  Learn
                </NextLink>
              </NavbarItem>
              {user.isAdmin && (
                <NavbarItem key="admin">
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium"
                    )}
                    color="foreground"
                    href={"/admin"}
                  >
                    Admin
                  </NextLink>
                </NavbarItem>
              )}
            </>
          ) : (
            <>
              <NavbarItem key="login">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    isLoading && "opacity-0",
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={"/login"}
                >
                  Login
                </NextLink>
              </NavbarItem>

              <NavbarItem key="register">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    isLoading && "opacity-0",
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={"/register"}
                >
                  Register
                </NextLink>
              </NavbarItem>
            </>
          )}
        </ul>
        <ThemeSwitch />
      </NavbarContent>
      <NavbarContent className={clsx("sm:hidden basis-1  pl-4")} justify="end">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {!isLoading && user ? (
            <>
              <NavbarItem key="piece-editor">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={"/learn"}
                >
                  Learn
                </NextLink>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem key="login">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    isLoading && "opacity-0",
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={"/login"}
                >
                  Login
                </NextLink>
              </NavbarItem>

              <NavbarItem key="register">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    isLoading && "opacity-0",
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={"/register"}
                >
                  Register
                </NextLink>
              </NavbarItem>
            </>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
