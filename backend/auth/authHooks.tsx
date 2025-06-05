import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setDoc, doc, getDoc } from "firebase/firestore";

import { db, auth } from "../firebase/firebase";
import { TRoute } from "../consts/route";
import { TUser } from "../types/authTypes";

export function useAuth() {
  const [authUser, authLoading, error] = useAuthState(auth);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (authUser) {
        const ref = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(ref);

        console.log("get uer");
        console.log(docSnap.data());
        setUser(docSnap.data() as TUser);
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (authUser) {
        fetchData();
      } else {
        console.log("You are not logged in");
        router.push("/");
        setLoading(false);
      } // Not signed in
    }
  }, [authLoading]);

  function refetchUser() {
    console.log("refetch use");
    setLoading(true);
    async function fetchData() {
      if (authUser) {
        const ref = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(ref);

        setUser(docSnap.data() as TUser);
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (authUser) {
        fetchData();
      } else {
        console.log("You are not logged in");
        router.push("/");
        setLoading(false);
      } // Not signed in
    }
  }

  return { refetchUser, user, isLoading, error };
}

export function useLogin(refetchUser: () => void) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string>();

  async function login({
    email,
    password,
    redirectTo,
  }: {
    email: string;
    password: string;
    redirectTo: TRoute;
  }) {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("sign in success");
      router.push("/" + redirectTo);
      refetchUser();
      console.log("refresh complete");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message as string);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return { login, isLoading, error };
}

export function useRegister() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function register({
    name,
    email,
    password,
    redirectTo,
  }: {
    name: string;
    email: string;
    password: string;
    redirectTo: TRoute;
  }) {
    setLoading(true);

    const usernameExists = false;

    // TODO: Make it so that everyone can access the list of usernames but not everything else (firebase rule)
    if (usernameExists) {
      console.log("username already exists");
      setLoading(false);
    } else {
      try {
        console.log(auth);
        const res = await createUserWithEmailAndPassword(auth, email, password);

        console.log(res);
        const userToAdd: TUser = {
          id: res.user.uid,
          email: email,
          name: name,
          dateCreated: new Date(),
          level: 1,
          projectProgress: null,
          isAdmin: false,
        };

        await setDoc(doc(db, "users", res.user.uid), userToAdd);

        router.push("/" + redirectTo);
      } catch (error) {
        console.log("error: " + error);
        console.log((error as any).message);
        setError((error as any).message);
      } finally {
        setLoading(false);
      }
    }
  }

  return { register, error, isLoading };
}

export function useLogout() {
  const [signOut, isLoading] = useSignOut(auth);
  const router = useRouter();

  async function logout() {
    if (await signOut()) {
      console.log("Successfully signed out.");
      router.push("/login");
    } // else: show error [signOut() returns false if failed]
  }

  return { logout, isLoading };
}
