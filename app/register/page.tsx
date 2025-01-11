/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useRegister } from "@/backend/auth/authHooks";
import { Button } from "@nextui-org/button";
export default function Register() {
  const router = useRouter();
  const { register: signup, error } = useRegister();
  const { register, handleSubmit } = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleRegister(data: any) {
    signup({
      name: data.name,
      email: data.email,
      password: data.password,
      redirectTo: "login",
    });
  }

  return (
    <div className="w-full h-full flex justify-center ">
      <div className="max-w-3xl loginForm mt-12">
        <h1 className="font-bold text-2xl text-center mb-5">Register</h1>

        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleRegister)}
        >
          <label>Full Name</label>
          <input
            className="px-5 py-3 rounded-lg border-2"
            placeholder="Name"
            type="text"
            {...register("name")}
          />
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
          <Button className="bg-primary text-slate-50" type="submit">
            Register
          </Button>
          {error && (
            <>
              <p className="text-danger-500">{error}</p>
            </>
          )}
          <Button
            className="bg-secondary text-slate-50"
            onClick={() => {
              router.push("/login");
            }}
          >
            Already Have an Account? Log in
          </Button>
        </form>
      </div>
    </div>
  );
}
