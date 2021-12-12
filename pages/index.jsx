import Head from "next/head";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      <main
        className={
          "flex flex-col items-center justify-center w-screen h-screen px-8 pt-16"
        }
      >
        <h1 className={"text-4xl sm:text-5xl font-bold text-gradient"}>
          Practice Parrot
        </h1>
        <h2 className="max-w-3xl text-center text-lg sm:text-xl">
          For classical musicians, practicing is important, but can be boring.
          Practice Parrot makes practicing more rewarding, with a practice
          parrot buddy, rainbow colors and a competitive leaderboard!
        </h2>
        <div className="mt-4">
          <Link href={session ? "/practice" : "/sign-in"}>
            <a className="bg-gray-800 text-gray-50 text-2xl px-4 py-2 rounded shadow-lg shadow-primary-100 hover:shadow-secondary-300 duration-500">
              {session ? "Get Started" : "Sign In"}
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
