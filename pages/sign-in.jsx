import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

const SignIn = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") {
    router.replace("/");
  }
  if (status === "loading") return null;
  return (
    <div className="min-h-screen bg-gray-100 px-8 pt-32 pb-16">
      <div className="rounded-xl bg-white max-w-lg px-16 py-8 text-center mx-auto shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold">Sign in to</h1>
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient underline decoration-accent-400">
          Practice Parrot
        </h1>
        <div className="font-semibold flex flex-col items-center mt-8 gap-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 font-medium w-max py-2 px-6 bg-primary-100 hover:bg-primary-200 duration-150 border-secondary-400 border-2 rounded-lg"
          >
            <FcGoogle className="w-6 h-6" /> <span>Sign in with Google</span>
          </button>
          <button
            onClick={() => signIn("github")}
            className="flex items-center gap-2 font-medium w-max py-2 px-6 bg-primary-800 hover:bg-primary-900 duration-150 text-gray-50 border-accent-400 border-2 rounded-lg"
          >
            <SiGithub className="w-6 h-6" />
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
