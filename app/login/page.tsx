/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "@heroui/button";

import { TLoginDetails } from "@/backend/types/authTypes";
import { useLogin, useGoogleLogin, useGitHubLogin } from "@/backend/auth/authHooks";
import { useContext } from "react";
import { AuthContext } from "@/providers/authContext";

export default function Login() {
  const router = useRouter();
  const { refetchUser } = useContext(AuthContext);
  const { login, isLoading, error } = useLogin(refetchUser);
  const { login: googleLogin, isLoading: googleLoading, error: googleError } = useGoogleLogin(refetchUser);
  const { login: githubLogin, isLoading: githubLoading, error: githubError } = useGitHubLogin(refetchUser);
  const { register, handleSubmit } = useForm();

  async function handleLogin(data: TLoginDetails) {
    login({
      email: data.email,
      password: data.password,
      redirectTo: "learn",
    });
  }
  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-3xl mt-12">
        <h1 className="font-bold text-2xl text-center mb-5">Log In</h1>

        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit((data) => {
            handleLogin(data as TLoginDetails);
          })}
        >
          <label>Email</label>
          <input
            className="px-5 py-3 rounded-lg border-2"
            placeholder="user@email.com"
            type="email"
            {...register("email")}
          />
          <label>Password</label>
          <input
            className="px-5 py-3 rounded-lg border-2"
            placeholder="password123"
            type="password"
            {...register("password")}
          />
          <Button
            className={clsx(
              "bg-primary text-slate-50",
              isLoading && "opacity-75 bg-default"
            )}
            type="submit"
          >
            {!isLoading ? <p>Log in</p> : <p>Logging in...</p>}
          </Button>
          {error && (
            <>
              <p className="text-danger text-sm font-normal">
                Error logging in. See console.
              </p>
              <p className="text-danger text-sm font-light">{error}</p>
            </>
          )}
          <Button
            className="bg-secondary text-slate-50"
            onClick={() => {
              router.push("/register");
            }}
          >
            Register for new account
          </Button>
        </form>
        <div className="flex flex-col gap-2 mt-3">
          <Button
            className="bg-blue-500 text-slate-50"
            onClick={() => googleLogin({ redirectTo: "learn" })}
            disabled={googleLoading}
          >
            {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
          </Button>
          {googleError && (
            <p className="text-danger text-sm font-light">{googleError}</p>
          )}
          <Button
            className="bg-gray-800 text-slate-50"
            onClick={() => githubLogin({ redirectTo: "learn" })}
            disabled={githubLoading}
          >
            {githubLoading ? "Signing in with GitHub..." : "Sign in with GitHub"}
          </Button>
          {githubError && (
            <p className="text-danger text-sm font-light">{githubError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
