import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.redirect("/404");
  }
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }
  const { time } = JSON.parse(req.body);
  if (!time) {
    res.status(400).end();
  }
  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      timeTotal: {
        increment: time,
      },
    },
  });
  res.status(200).end();
}
