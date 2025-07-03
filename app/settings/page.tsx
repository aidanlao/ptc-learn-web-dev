"use client";
import { useContext } from "react";
import { AuthContext } from "@/providers/authContext";
import { SignOut } from "@/components/signOutButton";

export default function SettingsPage() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <div className="p-5">
        <SignOut />
      </div>
    </>
  );
}
