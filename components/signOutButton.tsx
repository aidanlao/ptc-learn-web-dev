import { auth } from "@/backend/firebase/firebase";
import { AuthContext } from "@/providers/authContext";
import { useContext } from "react";
import { useSignOut } from "react-firebase-hooks/auth";

export const SignOut = () => {
  const [signOut, loading, error] = useSignOut(auth);

  const { refetchUser } = useContext(AuthContext);
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <button
        onClick={async () => {
          const success = await signOut();
          if (success) {
            console.log("Sign out successful");
          }
          const successRefetch = await refetchUser();
          if (success && successRefetch) {
            alert("You are now signed out.");
          }
        }}
      >
        Sign out
      </button>
    </div>
  );
};
