import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Parrot from "./Parrot";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="h-16 px-8 bg-primary-900 text-primary-50 fixed top-0 left-0 right-0">
      <div className="h-full max-w-5xl mx-auto flex items-center justify-between text-sm sm:text-base">
        <div className="flex items-center gap-4 sm:gap-8 font-light">
          <Link href="/">
            <a className="text-secondary-50 underline decoration-accent-300 drop-shadow-md font-bold">
              <span>Practice Parrot</span>
            </a>
          </Link>
          <Link href="/practice">
            <a>
              <span className="hidden sm:block">Practice Room</span>
              <span className="sm:hidden">PR</span>
            </a>
          </Link>
          <Link href="/leaderboard">
            <a>
              <span className="hidden sm:block">Leaderboard</span>
              <span className="sm:hidden">LB</span>
            </a>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <a className="flex items-center gap-2">
                  <div
                    className="w-6 h-6"
                    style={{ color: session.user.parrotColor }}
                  >
                    <Parrot />
                  </div>
                  <span className="hidden sm:block">{session.user.name}</span>
                </a>
              </Link>
              <span>&bull;</span>
              <button onClick={() => signOut()}>
                <span className="hidden sm:block">Sign Out</span>
                <span className="sm:hidden">&rarr;</span>
              </button>
            </div>
          ) : (
            <Link href="/sign-in">
              <a>Sign In</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
