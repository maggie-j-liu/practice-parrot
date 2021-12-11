import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="h-16 px-8 bg-primary-900 text-primary-50 fixed top-0 left-0 right-0">
      <div className="h-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8 font-light">
          <Link href="/">
            <a className="text-secondary-50 underline decoration-accent-300 drop-shadow-md font-bold">
              Practice Parrot
            </a>
          </Link>
          <Link href="/practice">
            <a>Practice Room</a>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {session ? (
            <div>
              {session.user.name}
              <span className="mx-2">&bull;</span>
              <button onClick={() => signOut()}>Sign Out</button>
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
