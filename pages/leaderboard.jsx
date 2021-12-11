import prisma from "../lib/prisma";
import { getSession } from "next-auth/react";
import formatTime from "../lib/formatTime";
import Parrot from "../components/Parrot";

const Leaderboard = ({ leaderboard, user, userRank }) => {
  return (
    <main className="pt-32 pb-16 px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="mx-auto w-max text-5xl text-gradient font-bold">
          Leaderboard
        </h1>
        <h2 className="text-lg text-center">
          Keep <i className="underline decoration-accent-300">practicing</i>!
          Practice 40 hours every day and you'll be on top of the leaderboard!
        </h2>
        <p className="mt-6">
          Your current rank:{" "}
          <span className="text-secondary-800 font-bold">{userRank}</span>
        </p>
        <table className="w-full mt-2">
          <thead className="text-left border-b-2">
            <tr>
              <th className="px-2">Rank</th>
              <th className="px-2">Name</th>
              <th className="px-2">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leaderboard.map((person) => (
              <tr
                key={person.email}
                className={
                  person.rank === userRank
                    ? "bg-gradient-to-r from-secondary-100 to-accent-100 font-semibold"
                    : ""
                }
              >
                <td className="p-2">{person.rank}</td>
                <td className="p-2 flex items-center gap-2">
                  <div
                    className="w-6 h-6"
                    style={{ color: person.parrotColor }}
                  >
                    <Parrot />
                  </div>
                  {person.name}
                </td>
                <td className="p-2">{formatTime(person.timeTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default Leaderboard;
export const getServerSideProps = async ({ req }) => {
  const { user } = await getSession({ req });
  const TAKE = 30;
  let top = await prisma.user.findMany({
    take: TAKE,
    orderBy: {
      timeTotal: "desc",
    },
    select: {
      email: true,
      name: true,
      timeTotal: true,
      parrotColor: true,
    },
  });
  let userRank = TAKE + 1;
  top = top.map((u, i) => {
    if (u.email === user.email) {
      userRank = i + 1;
    }
    const { email, ...rest } = u;
    return { ...rest, rank: i + 1 };
  });
  if (userRank === TAKE + 1) {
    const you = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const { email, ...rest } = you;
    top.push({ ...rest, rank: top.length + 1 });
  }
  console.log(top);
  return {
    props: {
      leaderboard: top,
      user,
      userRank,
    },
  };
};
