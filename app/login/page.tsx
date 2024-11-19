/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "@nextui-org/button";

import { TLoginDetails } from "@/backend/types/authTypes";
import { useLogin } from "@/backend/auth/authHooks";

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
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
              <p className="text-danger text-sm font-light">
                {error}
              </p>
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
      </div>
    </div>
  );
}
