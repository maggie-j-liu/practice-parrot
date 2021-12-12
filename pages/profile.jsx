import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Parrot from "../components/Parrot";
import { useRouter } from "next/router";

const Profile = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name);
      setColor(session.user.parrotColor);
    } else if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [session, status]);
  const save = async () => {
    setSaving(true);
    if (name === session.user.name && color === session.user.parrotColor) {
      return;
    }
    await fetch("/api/editprofile", {
      method: "POST",
      body: JSON.stringify({
        name,
        color,
      }),
    });
    setSaving(false);
    router.reload();
  };
  if (!session?.user) return null;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="w-max mx-auto text-5xl font-bold text-gradient">
        Profile
      </h1>
      <div className="space-y-2">
        <label className="flex items-center justify-between gap-6">
          <p className="text-lg">Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="flex items-center justify-between gap-6">
          <div className="">
            <p className="text-lg">Parrot's Color</p>
            <p className="text-sm text-primary-700">
              Choose a color for your profile picture parrot.
            </p>
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <div style={{ color }}>
          <Parrot />
        </div>
      </div>
      <button
        onClick={() => save()}
        className="disabled:cursor-not-allowed disabled:bg-primary-200 disabled:hover:bg-primary-200 bg-secondary-200 hover:bg-secondary-300 duration-150 px-3 py-0.5 text-lg rounded-md"
        disabled={!name || !color || saving}
      >
        {saving ? "Saving" : "Save"}
      </button>
    </div>
  );
};

export default Profile;
