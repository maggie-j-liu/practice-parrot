import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
        <h1 className="text-4xl font-bold">Sign in to</h1>
        <h1 className="text-5xl font-bold text-gradient underline decoration-primary-400">
          Practice Parrot
        </h1>
        <div className="font-semibold flex flex-col items-center mt-8 gap-4">
          <button
            onClick={() => signIn("google")}
            className="font-medium w-max py-2 px-6 bg-gray-100 border-red-400 border-2 rounded-lg"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => signIn("github")}
            className="font-medium w-max py-2 px-6 bg-gray-800 text-gray-50 border-gray-800 border-2 rounded-lg"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
