"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "../Theme/Theme";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;
  const handleSignOut = () => {
    // console.log("signing out");
    signOut();
  };
  return (
    <nav className=" p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="/">
          TrueFeedback
        </a>

        {session ? (
          <div className="flex justify-center gap-4">
            <span className="w-full mr-4">
              Welcome {user.username || user.email}
            </span>

            <Button className="w-full md:m-auto" onClick={handleSignOut}>
              Sign Out
            </Button>
            <ModeToggle />
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <ModeToggle />
            <Link href="/sign-in">
              <Button className="w-full md:m-auto">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
