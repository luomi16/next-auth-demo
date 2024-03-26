"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();
  return (
    <div className="flex justify-between pb-4 border-b mb-4">
      {status === "authenticated" ? (
        <div><button className="btn" onClick={() => signOut()}>Sign out</button></div>
      ) : (
        <div className="flex items-center">
          <Link className="btn" href={"/sign-in"}>
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}